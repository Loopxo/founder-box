import * as SQLite from "expo-sqlite"
import { FounderBoxApiError, type FounderBoxClient, type RequestOptions } from "@founderbox/api-client"

type QueueMethod = NonNullable<RequestOptions["method"]>

interface QueueRow {
  id: string
  path: string
  method: QueueMethod
  body: string
  attempts: number
  lastError: string | null
  createdAt: string
}

export interface QueuedMutation {
  id: string
  path: string
  method: QueueMethod
  body: unknown
  attempts: number
  lastError: string | null
  createdAt: string
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null

function queueId() {
  return `fbq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
}

async function database() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("founderbox-mobile.db").then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS mutation_queue (
          id TEXT PRIMARY KEY NOT NULL,
          path TEXT NOT NULL,
          method TEXT NOT NULL,
          body TEXT NOT NULL,
          attempts INTEGER NOT NULL DEFAULT 0,
          lastError TEXT,
          createdAt TEXT NOT NULL
        );
      `)
      return db
    })
  }
  return dbPromise
}

export async function enqueueMutation(path: string, body: unknown, method: QueueMethod = "POST") {
  const db = await database()
  const row = {
    id: queueId(),
    path,
    method,
    body: JSON.stringify(body ?? {}),
    createdAt: new Date().toISOString(),
  }
  await db.runAsync(
    "INSERT INTO mutation_queue (id, path, method, body, attempts, createdAt) VALUES (?, ?, ?, ?, 0, ?)",
    row.id,
    row.path,
    row.method,
    row.body,
    row.createdAt,
  )
  return row.id
}

export async function queuedMutations() {
  const db = await database()
  const rows = await db.getAllAsync<QueueRow>("SELECT * FROM mutation_queue ORDER BY createdAt ASC")
  return rows.map((row) => ({
    ...row,
    body: JSON.parse(row.body) as unknown,
  }))
}

export async function queuedMutationCount() {
  const db = await database()
  const rows = await db.getAllAsync<{ count: number }>("SELECT COUNT(*) as count FROM mutation_queue")
  return Number(rows[0]?.count || 0)
}

export async function clearQueuedMutation(id: string) {
  const db = await database()
  await db.runAsync("DELETE FROM mutation_queue WHERE id = ?", id)
}

async function markFailed(id: string, attempts: number, error: string) {
  const db = await database()
  await db.runAsync("UPDATE mutation_queue SET attempts = ?, lastError = ? WHERE id = ?", attempts + 1, error, id)
}

function shouldQueue(error: unknown) {
  if (error instanceof FounderBoxApiError) return error.status >= 500 || error.status === 408 || error.status === 429
  return true
}

export async function requestOrQueue<T>(client: FounderBoxClient, path: string, body: unknown, method: QueueMethod = "POST") {
  try {
    const data = await client.request<T>(path, { method, body })
    return { queued: false as const, data }
  } catch (error) {
    if (!shouldQueue(error)) throw error
    const id = await enqueueMutation(path, body, method)
    return { queued: true as const, id }
  }
}

export async function flushOfflineQueue(client: FounderBoxClient) {
  const rows = await queuedMutations()
  const result = { attempted: rows.length, synced: 0, failed: 0 }

  for (const row of rows) {
    try {
      await client.request(row.path, { method: row.method, body: row.body })
      await clearQueuedMutation(row.id)
      result.synced += 1
    } catch (error) {
      result.failed += 1
      const message = error instanceof Error ? error.message : "Sync failed"
      await markFailed(row.id, row.attempts, message)
      if (error instanceof FounderBoxApiError && error.status === 401) break
    }
  }

  return result
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "./prisma"

const DEFAULT_JSON_LIMIT_BYTES = Number(process.env.FOUNDERBOX_API_MAX_INPUT_BYTES || 200_000)
const DEFAULT_RATE_LIMIT = Number(process.env.FOUNDERBOX_API_MUTATION_LIMIT_PER_MINUTE || 120)

function normalizeOrigin(value?: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return `${url.protocol}//${url.host}`
  } catch {
    return null
  }
}

function requestOrigin(request: NextRequest) {
  const origin = normalizeOrigin(request.headers.get("origin"))
  if (origin) return origin
  return normalizeOrigin(request.headers.get("referer"))
}

export function isSafeMethod(method: string) {
  return ["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())
}

export function assertSameOrigin(request: NextRequest) {
  if (isSafeMethod(request.method)) return null

  const contentLength = Number(request.headers.get("content-length") || 0)
  if (contentLength > DEFAULT_JSON_LIMIT_BYTES) {
    return NextResponse.json({ error: `Request body is too large. Maximum size is ${DEFAULT_JSON_LIMIT_BYTES} bytes.` }, { status: 413 })
  }

  const source = requestOrigin(request)
  if (!source) return NextResponse.json({ error: "Missing Origin or Referer header." }, { status: 403 })

  const current = normalizeOrigin(request.nextUrl.origin)
  const web = normalizeOrigin(process.env.FOUNDERBOX_WEB_URL)
  const allowed = new Set([current, web, ...(process.env.FOUNDERBOX_ALLOWED_ORIGINS || "").split(",").map((item) => normalizeOrigin(item.trim()))].filter(Boolean))

  if (!allowed.has(source)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 })
  }

  return null
}

export async function readJsonBody<T extends Record<string, unknown> = Record<string, unknown>>(request: NextRequest, limitBytes = DEFAULT_JSON_LIMIT_BYTES): Promise<T> {
  const raw = await request.text()
  const bytes = Buffer.byteLength(raw, "utf8")
  if (bytes > limitBytes) {
    const error = new Error(`Request body is too large. Maximum size is ${limitBytes} bytes.`)
    error.name = "PAYLOAD_TOO_LARGE"
    throw error
  }
  if (!raw.trim()) return {} as T
  return JSON.parse(raw) as T
}

export function payloadTooLargeResponse(error: unknown) {
  if (error instanceof Error && error.name === "PAYLOAD_TOO_LARGE") {
    return NextResponse.json({ error: error.message }, { status: 413 })
  }
  return null
}

function minuteKey(date = new Date()) {
  return date.toISOString().slice(0, 16)
}

function nextMinute() {
  const date = new Date()
  date.setUTCMinutes(date.getUTCMinutes() + 1, 0, 0)
  return date
}

export async function enforceApiRateLimit(input: { userId?: string | null; ip?: string | null; scope: string; limit?: number }) {
  const limit = input.limit || DEFAULT_RATE_LIMIT
  const subject = input.userId || input.ip || "anonymous"
  const scope = `api:${input.scope}`
  const bucketKey = `${subject}:${minuteKey()}`
  const bucket = await prisma.rateLimitBucket.upsert({
    where: { scope_bucketKey: { scope, bucketKey } },
    update: { count: { increment: 1 } },
    create: {
      scope,
      bucketKey,
      count: 1,
      resetAt: nextMinute(),
      userId: input.userId || undefined,
    },
  })

  if (bucket.count > limit) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again shortly.", resetAt: bucket.resetAt.toISOString() }, { status: 429 })
  }

  return null
}

export function safeInternalPath(value: unknown, fallback = "/accountability/today") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback
  try {
    const url = new URL(value, "https://founderbox.local")
    if (url.origin !== "https://founderbox.local") return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

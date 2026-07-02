import { NextRequest, NextResponse } from "next/server"
import { createApiKey, getApiKeyPrefix, hashSecret } from "@founderbox/core"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeAuditEvent } from "@/lib/audit"

function apiKeySecret() {
  return process.env.API_KEY_HASH_SECRET || process.env.SESSION_SECRET || "founderbox-dev-api-key-secret"
}

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, prefix: true, createdAt: true, lastUsedAt: true, revokedAt: true },
  })

  const usage = await prisma.toolRun.groupBy({
    by: ["toolName"],
    where: { userId: user.id, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    _count: { _all: true },
  })

  return NextResponse.json({ keys, usage })
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "AI client key"
  const key = createApiKey()

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      prefix: getApiKeyPrefix(key),
      keyHash: hashSecret(key, apiKeySecret()),
      userId: user.id,
    },
    select: { id: true, name: true, prefix: true, createdAt: true },
  })

  await writeAuditEvent({ action: "api_key.created", userId: user.id, entityType: "ApiKey", entityId: apiKey.id, metadata: { name, prefix: apiKey.prefix }, request })

  return NextResponse.json({ key, apiKey })
}

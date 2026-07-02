import { hashSecret, hasProAccess } from "@founderbox/core"
import { prisma } from "./db.js"
import type { McpRequestContext } from "./context.js"

function apiKeySecret() {
  return process.env.API_KEY_HASH_SECRET || process.env.SESSION_SECRET || "founderbox-dev-api-key-secret"
}

export async function authenticateBearer(authorization: string | undefined): Promise<McpRequestContext | null> {
  if (!authorization?.startsWith("Bearer ")) return null

  const token = authorization.slice("Bearer ".length).trim()
  if (!token.startsWith("fb_")) return null

  if (process.env.FOUNDERBOX_DEV_API_KEY && token === process.env.FOUNDERBOX_DEV_API_KEY) {
    return { plan: "dev", email: "dev@founderbox.local", userId: "dev-user", apiKeyId: "dev-key" }
  }

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      keyHash: hashSecret(token, apiKeySecret()),
      revokedAt: null,
    },
    include: { user: true },
  })

  if (!apiKey) return null

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  })

  const subscription = await prisma.subscription.findFirst({
    where: { userId: apiKey.userId },
    include: { plan: true },
    orderBy: { updatedAt: "desc" },
  })

  return {
    plan: process.env.FOUNDERBOX_DISABLE_LIMITS === "true" ? "self-host" : hasProAccess(subscription) ? "founding-pro" : "hosted-free",
    userId: apiKey.userId,
    apiKeyId: apiKey.id,
    email: apiKey.user.email,
  }
}

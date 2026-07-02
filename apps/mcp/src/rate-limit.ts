import { prisma } from "./db.js"
import type { McpRequestContext } from "./context.js"

const TEXT_CALLS_PER_DAY = Number(process.env.FOUNDERBOX_TEXT_CALLS_PER_DAY || 500)
const PDF_CALLS_PER_DAY = Number(process.env.FOUNDERBOX_PDF_CALLS_PER_DAY || 20)
const FREE_ACCOUNTABILITY_CALLS_PER_DAY = Number(process.env.FOUNDERBOX_FREE_ACCOUNTABILITY_CALLS_PER_DAY || 50)
const PRO_ACCOUNTABILITY_CALLS_PER_DAY = Number(process.env.FOUNDERBOX_PRO_ACCOUNTABILITY_CALLS_PER_DAY || 1000)

function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function nextReset() {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + 1)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

function limitForScope(context: McpRequestContext, scope: string) {
  if (scope === "pdf") return PDF_CALLS_PER_DAY
  if (scope === "accountability") return context.plan === "founding-pro" ? PRO_ACCOUNTABILITY_CALLS_PER_DAY : FREE_ACCOUNTABILITY_CALLS_PER_DAY
  return TEXT_CALLS_PER_DAY
}

export async function getRateLimitStatus(context: McpRequestContext | undefined) {
  const resetAt = nextReset()

  if (!context?.userId || context.plan === "self-host" || context.plan === "dev" || process.env.FOUNDERBOX_DISABLE_LIMITS === "true") {
    return {
      limited: false,
      resetAt: resetAt.toISOString(),
      buckets: [],
    }
  }

  const scopes = ["text", "pdf", "accountability"]
  const buckets = await prisma.rateLimitBucket.findMany({
    where: {
      userId: context.userId,
      scope: { in: scopes },
      bucketKey: { in: scopes.map((scope) => `${context.userId}:${scope}:${dayKey()}`) },
    },
  })

  return {
    limited: true,
    resetAt: resetAt.toISOString(),
    buckets: scopes.map((scope) => {
      const bucket = buckets.find((item) => item.scope === scope)
      const limit = limitForScope(context, scope)
      const used = bucket?.count || 0
      return {
        scope,
        used,
        limit,
        remaining: Math.max(limit - used, 0),
        resetAt: (bucket?.resetAt || resetAt).toISOString(),
      }
    }),
  }
}

export async function enforceRateLimit(context: McpRequestContext | undefined, toolName: string) {
  if (!context || context.plan === "self-host" || context.plan === "dev" || process.env.FOUNDERBOX_DISABLE_LIMITS === "true") {
    return
  }

  const isPdf = toolName.endsWith("_render_pdf")
  const isAccountability = toolName.startsWith("accountability_")
  const scope = isPdf ? "pdf" : isAccountability ? "accountability" : "text"
  const limit = limitForScope(context, scope)
  const bucketKey = `${context.userId}:${scope}:${dayKey()}`
  const resetAt = nextReset()

  const bucket = await prisma.rateLimitBucket.upsert({
    where: { scope_bucketKey: { scope, bucketKey } },
    update: { count: { increment: 1 } },
    create: { scope, bucketKey, count: 1, resetAt, userId: context.userId === "dev-user" ? undefined : context.userId },
  })

  if (bucket.count > limit) {
    if (scope === "pdf") {
      await prisma.suspiciousUsageFlag.create({
        data: {
          type: "excessive_pdf_renders",
          reason: `PDF render limit exceeded for ${context.userId}.`,
          severity: "medium",
          userId: context.userId === "dev-user" ? undefined : context.userId,
          metadata: { toolName, count: bucket.count, limit, resetAt: bucket.resetAt.toISOString() },
        },
      })
    }
    const error = new Error(`Hosted free ${scope} limit exceeded. Limit resets at ${bucket.resetAt.toISOString()}.`)
    error.name = "RATE_LIMITED"
    throw error
  }
}

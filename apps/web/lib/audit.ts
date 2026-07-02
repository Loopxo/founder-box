import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"
import { hashSecret } from "@founderbox/core"
import { prisma } from "./prisma"

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

export function requestMeta(request?: NextRequest) {
  return {
    ipAddress: request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request?.headers.get("x-real-ip") || undefined,
    userAgent: request?.headers.get("user-agent") || undefined,
  }
}

export function hashIp(ip?: string | null) {
  if (!ip) return undefined
  return hashSecret(ip, process.env.AUDIT_HASH_SECRET || process.env.SESSION_SECRET || "founderbox-dev-audit-secret")
}

export async function writeAuditEvent(input: {
  action: string
  userId?: string | null
  workspaceId?: string | null
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
  request?: NextRequest
}) {
  const meta = requestMeta(input.request)
  return prisma.auditEvent.create({
    data: {
      action: input.action,
      userId: input.userId || undefined,
      workspaceId: input.workspaceId || undefined,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata ? json(input.metadata) : undefined,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    },
  })
}

export async function flagSuspiciousUsage(input: {
  type: string
  reason: string
  severity?: "low" | "medium" | "high" | "critical"
  userId?: string | null
  workspaceId?: string | null
  metadata?: Record<string, unknown>
}) {
  return prisma.suspiciousUsageFlag.create({
    data: {
      type: input.type,
      reason: input.reason,
      severity: input.severity || "medium",
      userId: input.userId || undefined,
      workspaceId: input.workspaceId || undefined,
      metadata: input.metadata ? json(input.metadata) : undefined,
    },
  })
}

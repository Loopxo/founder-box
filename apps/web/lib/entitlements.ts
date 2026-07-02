import { getPlanLimits } from "@founderbox/core"
import { getUserPlan } from "./accountability"
import { prisma } from "./prisma"

export async function getEntitlements(userId: string, workspaceId?: string) {
  const plan = await getUserPlan(userId)
  const limits = getPlanLimits(plan)
  const activeFlows = workspaceId ? await prisma.flow.count({ where: { workspaceId, archivedAt: null, isActive: true } }) : 0
  return { plan, limits, activeFlows, isPro: plan === "founding-pro" }
}

export async function assertCanCreateFlow(userId: string, workspaceId: string) {
  const entitlements = await getEntitlements(userId, workspaceId)
  if (Number.isFinite(entitlements.limits.activeFlows) && entitlements.activeFlows >= entitlements.limits.activeFlows) {
    return { ok: false as const, reason: "Free plan allows one active custom flow. Upgrade to Founding Pro for unlimited flows." }
  }
  return { ok: true as const, entitlements }
}

export async function assertCanExport(userId: string) {
  const entitlements = await getEntitlements(userId)
  if (!entitlements.limits.exports) {
    return { ok: false as const, reason: "Exports are included in Founding Pro." }
  }
  return { ok: true as const, entitlements }
}

export async function assertCanUseCustomDashboards(userId: string) {
  const entitlements = await getEntitlements(userId)
  if (!entitlements.limits.customDashboards) {
    return { ok: false as const, reason: "Custom dashboards are included in Founding Pro." }
  }
  return { ok: true as const, entitlements }
}

export async function assertCanCreateShareReport(userId: string, workspaceId: string) {
  const entitlements = await getEntitlements(userId, workspaceId)
  const limit = entitlements.limits.shareReportsPerMonth
  if (Number.isFinite(limit)) {
    const start = new Date()
    start.setUTCDate(1)
    start.setUTCHours(0, 0, 0, 0)
    const count = await prisma.shareLink.count({ where: { workspaceId, createdById: userId, createdAt: { gte: start } } })
    if (count >= limit) {
      return { ok: false as const, reason: "Free plan includes 3 share reports per month. Upgrade to Founding Pro for unlimited reports." }
    }
  }
  return { ok: true as const, entitlements }
}

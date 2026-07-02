import { NextRequest, NextResponse } from "next/server"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const [workspaces, apiKeys, subscriptions, proofAssets, shareLinks, auditEvents] = await Promise.all([
    prisma.workspace.findMany({
      where: { members: { some: { userId: user.id } } },
      include: {
        flows: { include: { objects: { include: { fields: { include: { options: true } }, entries: true } }, views: true, dashboards: { include: { widgets: true } }, targets: true, metricDefinitions: true } },
        dailyReviews: true,
        weeklyReviews: true,
      },
    }),
    prisma.apiKey.findMany({ where: { userId: user.id }, select: { id: true, name: true, prefix: true, createdAt: true, revokedAt: true, lastUsedAt: true } }),
    prisma.subscription.findMany({ where: { userId: user.id } }),
    prisma.proofAsset.findMany({ where: { userId: user.id } }),
    prisma.shareLink.findMany({ where: { createdById: user.id } }),
    prisma.auditEvent.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 500 }),
  ])

  await writeAuditEvent({ action: "account.exported", userId: user.id, request })

  return NextResponse.json({
    exportedAt: new Date().toISOString(),
    user: { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
    apiKeys,
    subscriptions,
    workspaces,
    proofAssets,
    shareLinks,
    auditEvents,
  })
}

import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { assertCanUseCustomDashboards } from "@/lib/entitlements"
import { recordFlowVersion } from "@/lib/flow-version"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const allowed = await assertCanUseCustomDashboards(user.id)
  if (!allowed.ok) return NextResponse.json({ error: allowed.reason }, { status: 402 })

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const flow = await prisma.flow.findFirst({ where: { id, workspaceId: workspace.id } })
  if (!flow) return NextResponse.json({ error: "Flow not found." }, { status: 404 })

  const dashboard = await prisma.dashboard.create({
    data: {
      workspaceId: workspace.id,
      flowId: flow.id,
      name: body.name || `${flow.name} Dashboard`,
      config: body.config || {},
    },
  })

  await recordFlowVersion(flow.id, "dashboard.created", { dashboardId: dashboard.id })
  await writeAuditEvent({ action: "dashboard.created", userId: user.id, workspaceId: workspace.id, entityType: "Dashboard", entityId: dashboard.id, metadata: { flowId: flow.id }, request })
  return NextResponse.json({ dashboard })
}


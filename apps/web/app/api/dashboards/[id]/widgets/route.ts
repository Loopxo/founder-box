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
  const dashboard = await prisma.dashboard.findFirst({ where: { id, workspaceId: workspace.id } })
  if (!dashboard) return NextResponse.json({ error: "Dashboard not found." }, { status: 404 })

  const sortOrder = await prisma.dashboardWidget.count({ where: { dashboardId: dashboard.id } })
  const widget = await prisma.dashboardWidget.create({
    data: {
      dashboardId: dashboard.id,
      title: body.title || "Widget",
      type: body.type || "metric",
      config: body.config || {},
      sortOrder,
    },
  })

  if (dashboard.flowId) await recordFlowVersion(dashboard.flowId, "dashboard_widget.created", { dashboardId: dashboard.id, widgetId: widget.id })
  await writeAuditEvent({ action: "dashboard_widget.created", userId: user.id, workspaceId: workspace.id, entityType: "DashboardWidget", entityId: widget.id, metadata: { dashboardId: dashboard.id }, request })
  return NextResponse.json({ widget })
}


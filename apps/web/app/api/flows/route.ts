import { NextRequest, NextResponse } from "next/server"
import { getPlanLimits } from "@founderbox/core"
import { ensureWorkspaceForUser, getUserPlan, installFlowTemplate } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const workspace = await ensureWorkspaceForUser(user)
  const flows = await prisma.flow.findMany({
    where: { workspaceId: workspace.id, archivedAt: null },
    include: { objects: { orderBy: { sortOrder: "asc" } }, views: true },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json({ workspace, flows })
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const plan = await getUserPlan(user.id)
  const limits = getPlanLimits(plan)
  const activeCount = await prisma.flow.count({ where: { workspaceId: workspace.id, archivedAt: null, isActive: true } })

  if (Number.isFinite(limits.activeFlows) && activeCount >= limits.activeFlows) {
    return NextResponse.json({ error: "Free plan allows one active custom flow. Upgrade to Founding Pro for unlimited flows." }, { status: 402 })
  }

  if (body.templateKey) {
    const flow = await installFlowTemplate(workspace.id, body.templateKey)
    await writeAuditEvent({ action: "flow.template_installed", userId: user.id, workspaceId: workspace.id, entityType: "Flow", entityId: flow.id, metadata: { templateKey: body.templateKey }, request })
    return NextResponse.json({ flow })
  }

  const flow = await prisma.flow.create({
    data: {
      workspaceId: workspace.id,
      name: body.name || "Custom flow",
      description: body.description,
      persona: body.persona,
      templateKey: "custom",
      versions: { create: { version: 1, config: { objects: [] } } },
    },
  })

  await writeAuditEvent({ action: "flow.created", userId: user.id, workspaceId: workspace.id, entityType: "Flow", entityId: flow.id, metadata: { templateKey: "custom" }, request })
  return NextResponse.json({ flow })
}

import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { recordFlowVersion } from "@/lib/flow-version"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const flow = await prisma.flow.findFirst({ where: { id, workspaceId: workspace.id }, include: { objects: true } })
  if (!flow) return NextResponse.json({ error: "Flow not found." }, { status: 404 })

  const objectId = typeof body.objectId === "string" && flow.objects.some((object) => object.id === body.objectId) ? body.objectId : undefined
  const view = await prisma.flowView.create({
    data: {
      flowId: flow.id,
      objectId,
      name: body.name || "New view",
      type: body.type || "table",
      config: body.config || {},
    },
  })

  await recordFlowVersion(flow.id, "view.created", { viewId: view.id, type: view.type })
  await writeAuditEvent({ action: "flow_view.created", userId: user.id, workspaceId: workspace.id, entityType: "FlowView", entityId: view.id, metadata: { flowId: flow.id }, request })
  return NextResponse.json({ view })
}


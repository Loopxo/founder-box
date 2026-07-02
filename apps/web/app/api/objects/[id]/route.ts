import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { recordFlowVersion } from "@/lib/flow-version"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const object = await prisma.flowObject.findFirst({ where: { id, flow: { workspaceId: workspace.id } } })
  if (!object) return NextResponse.json({ error: "Object not found." }, { status: 404 })

  const updated = await prisma.flowObject.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      icon: body.icon,
      archivedAt: body.archived === true ? new Date() : body.archived === false ? null : undefined,
    },
  })
  await recordFlowVersion(object.flowId, body.archived === true ? "object.archived" : body.archived === false ? "object.restored" : "object.updated", { objectId: id })
  await writeAuditEvent({ action: "flow_object.updated", userId: user.id, workspaceId: workspace.id, entityType: "FlowObject", entityId: id, request })
  return NextResponse.json({ object: updated })
}

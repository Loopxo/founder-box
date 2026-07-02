import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { ACCOUNTABILITY_FIELD_TYPES } from "@founderbox/core"
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
  const field = await prisma.flowField.findFirst({ where: { id, object: { flow: { workspaceId: workspace.id } } }, include: { object: true } })
  if (!field) return NextResponse.json({ error: "Field not found." }, { status: 404 })
  if (body.type && !ACCOUNTABILITY_FIELD_TYPES.includes(body.type)) return NextResponse.json({ error: "Unsupported field type." }, { status: 400 })

  const updated = await prisma.flowField.update({
    where: { id },
    data: {
      name: body.name,
      type: body.type,
      required: body.required,
      settings: body.settings ? (body.settings as Prisma.InputJsonValue) : undefined,
      archivedAt: body.archived === true ? new Date() : body.archived === false ? null : undefined,
    },
  })
  await recordFlowVersion(field.object.flowId, body.archived === true ? "field.archived" : body.archived === false ? "field.restored" : "field.updated", { fieldId: id, objectId: field.objectId })
  await writeAuditEvent({ action: "flow_field.updated", userId: user.id, workspaceId: workspace.id, entityType: "FlowField", entityId: id, request })
  return NextResponse.json({ field: updated })
}

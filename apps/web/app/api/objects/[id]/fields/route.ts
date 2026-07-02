import { NextRequest, NextResponse } from "next/server"
import { ACCOUNTABILITY_FIELD_TYPES } from "@founderbox/core"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { recordFlowVersion } from "@/lib/flow-version"
import { prisma } from "@/lib/prisma"

function keyFromName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "field"
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const object = await prisma.flowObject.findFirst({ where: { id, flow: { workspaceId: workspace.id } } })
  if (!object) return NextResponse.json({ error: "Object not found." }, { status: 404 })
  if (!ACCOUNTABILITY_FIELD_TYPES.includes(body.type)) return NextResponse.json({ error: "Unsupported field type." }, { status: 400 })

  const sortOrder = await prisma.flowField.count({ where: { objectId: object.id } })
  const field = await prisma.flowField.create({
    data: {
      objectId: object.id,
      key: body.key || keyFromName(body.name || "Field"),
      name: body.name || "Field",
      type: body.type,
      required: Boolean(body.required),
      settings: body.settings || {},
      sortOrder,
      options: {
        create: Array.isArray(body.options)
          ? body.options.map((option: string, index: number) => ({ label: option, value: option, sortOrder: index }))
          : [],
      },
    },
    include: { options: true },
  })

  await recordFlowVersion(object.flowId, "field.created", { objectId: object.id, fieldId: field.id, key: field.key })
  await writeAuditEvent({ action: "flow_field.created", userId: user.id, workspaceId: workspace.id, entityType: "FlowField", entityId: field.id, metadata: { objectId: object.id, flowId: object.flowId }, request })
  return NextResponse.json({ field })
}

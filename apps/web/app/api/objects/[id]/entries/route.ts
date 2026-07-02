import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { validateFieldValue, type AccountabilityFieldType } from "@founderbox/core"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const object = await prisma.flowObject.findFirst({
    where: { id, flow: { workspaceId: workspace.id } },
    include: { fields: { where: { archivedAt: null } } },
  })
  if (!object) return NextResponse.json({ error: "Object not found." }, { status: 404 })

  const values = (body.values || {}) as Record<string, unknown>
  const fieldByKey = new Map(object.fields.map((field) => [field.key, field]))
  for (const [key, value] of Object.entries(values)) {
    const field = fieldByKey.get(key)
    if (!field) continue
    const validation = validateFieldValue(field.type as AccountabilityFieldType, value)
    if (!validation.valid) return NextResponse.json({ error: `${field.name}: ${validation.message}` }, { status: 400 })
  }

  const entry = await prisma.entry.create({
    data: {
      workspaceId: workspace.id,
      flowId: object.flowId,
      objectId: object.id,
      createdById: user.id,
      systemType: body.systemType,
      title: body.title,
      summary: body.summary,
      happenedAt: body.happenedAt ? new Date(body.happenedAt) : new Date(),
      data: values as Prisma.InputJsonValue,
      values: {
        create: Object.entries(values)
          .filter(([key]) => fieldByKey.has(key))
          .map(([key, value]) => ({ fieldId: fieldByKey.get(key)!.id, value: value as Prisma.InputJsonValue })),
      },
    },
  })

  await writeAuditEvent({ action: "entry.created", userId: user.id, workspaceId: workspace.id, entityType: "Entry", entityId: entry.id, metadata: { objectId: object.id, objectKey: object.key }, request })
  return NextResponse.json({ entry })
}

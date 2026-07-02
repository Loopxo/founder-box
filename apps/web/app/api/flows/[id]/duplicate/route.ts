import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { assertCanCreateFlow } from "@/lib/entitlements"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const workspace = await ensureWorkspaceForUser(user)
  const allowed = await assertCanCreateFlow(user.id, workspace.id)
  if (!allowed.ok) return NextResponse.json({ error: allowed.reason }, { status: 402 })

  const source = await prisma.flow.findFirst({
    where: { id, workspaceId: workspace.id },
    include: { objects: { include: { fields: { include: { options: true } } } }, views: true, metricDefinitions: true, targets: true },
  })
  if (!source) return NextResponse.json({ error: "Flow not found." }, { status: 404 })

  const duplicate = await prisma.$transaction(async (tx) => {
    const flow = await tx.flow.create({
      data: {
        workspaceId: workspace.id,
        templateKey: source.templateKey,
        name: `${source.name} Copy`,
        description: source.description,
        persona: source.persona,
      },
    })
    const objectMap = new Map<string, string>()
    for (const object of source.objects) {
      const created = await tx.flowObject.create({
        data: { flowId: flow.id, key: `${object.key}_${Date.now()}`.slice(0, 48), name: object.name, description: object.description, icon: object.icon, sortOrder: object.sortOrder },
      })
      objectMap.set(object.id, created.id)
    }
    for (const object of source.objects) {
      const objectId = objectMap.get(object.id)!
      for (const field of object.fields) {
        const created = await tx.flowField.create({
          data: {
            objectId,
            targetObjectId: field.targetObjectId ? objectMap.get(field.targetObjectId) : undefined,
            key: field.key,
            name: field.name,
            type: field.type,
            required: field.required,
            defaultValue: field.defaultValue as Prisma.InputJsonValue | undefined,
            settings: field.settings as Prisma.InputJsonValue | undefined,
            sortOrder: field.sortOrder,
          },
        })
        for (const option of field.options) {
          await tx.flowFieldOption.create({ data: { fieldId: created.id, label: option.label, value: option.value, color: option.color, sortOrder: option.sortOrder } })
        }
      }
    }
    for (const view of source.views) {
      await tx.flowView.create({ data: { flowId: flow.id, objectId: view.objectId ? objectMap.get(view.objectId) : undefined, name: view.name, type: view.type, config: view.config as Prisma.InputJsonValue } })
    }
    for (const metric of source.metricDefinitions) {
      await tx.metricDefinition.create({ data: { workspaceId: workspace.id, flowId: flow.id, key: `${metric.key}_${Date.now()}`.slice(0, 48), name: metric.name, type: metric.type, description: metric.description, config: metric.config as Prisma.InputJsonValue } })
    }
    await tx.flowVersion.create({ data: { flowId: flow.id, version: 1, config: { duplicatedFrom: source.id } } })
    return flow
  }, {
    maxWait: 15000,
    timeout: 30000
  })

  await writeAuditEvent({ action: "flow.duplicated", userId: user.id, workspaceId: workspace.id, entityType: "Flow", entityId: duplicate.id, metadata: { sourceFlowId: source.id }, request })
  return NextResponse.json({ flow: duplicate })
}

import { Prisma } from "@prisma/client"
import { prisma } from "./prisma"

type ExportedFlow = {
  templateKey?: string | null
  name?: string | null
  description?: string | null
  persona?: string | null
  objects?: Array<{
    id?: string
    key?: string | null
    name?: string | null
    description?: string | null
    icon?: string | null
    sortOrder?: number | null
    fields?: Array<{
      id?: string
      key?: string | null
      name?: string | null
      type?: string | null
      required?: boolean | null
      settings?: unknown
      defaultValue?: unknown
      sortOrder?: number | null
      targetObjectId?: string | null
      options?: Array<{ label?: string | null; value?: string | null; sortOrder?: number | null }>
    }>
  }>
  views?: Array<{ name?: string | null; type?: string | null; config?: unknown; objectId?: string | null }>
  targets?: Array<{ metricKey?: string | null; name?: string | null; period?: string | null; targetValue?: number | null; unit?: string | null; startsAt?: string | Date | null; endsAt?: string | Date | null }>
  metricDefinitions?: Array<{ key?: string | null; name?: string | null; type?: string | null; description?: string | null; config?: unknown }>
  dashboards?: Array<{
    name?: string | null
    config?: unknown
    widgets?: Array<{ title?: string | null; type?: string | null; config?: unknown; sortOrder?: number | null }>
  }>
}

function asJson(value: unknown): Prisma.InputJsonValue {
  return (value ?? {}) as Prisma.InputJsonValue
}

function asDate(value: unknown) {
  if (!value) return undefined
  const date = new Date(String(value))
  return Number.isNaN(date.getTime()) ? undefined : date
}

function keyFromName(name: string, fallback: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || fallback
}

function getFlowPayload(input: unknown): ExportedFlow {
  if (!input || typeof input !== "object") throw new Error("Flow import JSON must be an object.")
  const record = input as Record<string, unknown>
  const flow = "flow" in record ? record.flow : input
  if (!flow || typeof flow !== "object") throw new Error("Flow import JSON must include a flow object.")
  return flow as ExportedFlow
}

export async function importExportedFlow(workspaceId: string, input: unknown) {
  const exported = getFlowPayload(input)
  const objectIdMap = new Map<string, string>()
  const objectKeyMap = new Map<string, string>()

  return prisma.$transaction(async (tx) => {
    const flow = await tx.flow.create({
      data: {
        workspaceId,
        templateKey: exported.templateKey || "imported",
        name: exported.name ? `${exported.name} Copy` : "Imported flow",
        description: exported.description || undefined,
        persona: exported.persona || undefined,
        versions: {
          create: {
            version: 1,
            config: asJson({ importedAt: new Date().toISOString(), source: "flow-json" }),
          },
        },
      },
    })

    for (const [index, object] of (exported.objects || []).entries()) {
      const name = object.name || "Object"
      const created = await tx.flowObject.create({
        data: {
          flowId: flow.id,
          key: object.key || keyFromName(name, `object_${index + 1}`),
          name,
          description: object.description || undefined,
          icon: object.icon || undefined,
          sortOrder: object.sortOrder ?? index,
        },
      })
      if (object.id) objectIdMap.set(object.id, created.id)
      if (object.key) objectKeyMap.set(object.key, created.id)
    }

    for (const object of exported.objects || []) {
      const objectId = (object.id && objectIdMap.get(object.id)) || (object.key && objectKeyMap.get(object.key))
      if (!objectId) continue

      for (const [index, field] of (object.fields || []).entries()) {
        const name = field.name || "Field"
        const targetObjectId = field.targetObjectId ? objectIdMap.get(field.targetObjectId) : undefined
        await tx.flowField.create({
          data: {
            objectId,
            targetObjectId,
            key: field.key || keyFromName(name, `field_${index + 1}`),
            name,
            type: field.type || "text",
            required: Boolean(field.required),
            settings: asJson(field.settings),
            defaultValue: field.defaultValue == null ? undefined : asJson(field.defaultValue),
            sortOrder: field.sortOrder ?? index,
            options: {
              create: (field.options || []).map((option, optionIndex) => ({
                label: option.label || option.value || `Option ${optionIndex + 1}`,
                value: option.value || option.label || `option-${optionIndex + 1}`,
                sortOrder: option.sortOrder ?? optionIndex,
              })),
            },
          },
        })
      }
    }

    for (const view of exported.views || []) {
      await tx.flowView.create({
        data: {
          flowId: flow.id,
          objectId: view.objectId ? objectIdMap.get(view.objectId) : undefined,
          name: view.name || "View",
          type: view.type || "table",
          config: asJson(view.config),
        },
      })
    }

    for (const target of exported.targets || []) {
      if (!target.metricKey || !target.name) continue
      await tx.target.create({
        data: {
          workspaceId,
          flowId: flow.id,
          metricKey: target.metricKey,
          name: target.name,
          period: target.period || "week",
          targetValue: Number(target.targetValue || 0),
          unit: target.unit || undefined,
          startsAt: asDate(target.startsAt) || new Date(),
          endsAt: asDate(target.endsAt),
        },
      })
    }

    for (const metric of exported.metricDefinitions || []) {
      if (!metric.key || !metric.name) continue
      await tx.metricDefinition.create({
        data: {
          workspaceId,
          flowId: flow.id,
          key: metric.key,
          name: metric.name,
          type: metric.type || "counter",
          description: metric.description || undefined,
          config: asJson(metric.config),
        },
      })
    }

    for (const dashboard of exported.dashboards || []) {
      const created = await tx.dashboard.create({
        data: {
          workspaceId,
          flowId: flow.id,
          name: dashboard.name || `${flow.name} Dashboard`,
          config: asJson(dashboard.config),
        },
      })
      for (const [index, widget] of (dashboard.widgets || []).entries()) {
        await tx.dashboardWidget.create({
          data: {
            dashboardId: created.id,
            title: widget.title || "Widget",
            type: widget.type || "metric",
            config: asJson(widget.config),
            sortOrder: widget.sortOrder ?? index,
          },
        })
      }
    }

    return flow
  }, {
    maxWait: 15000,
    timeout: 30000
  })
}


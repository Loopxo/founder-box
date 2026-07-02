import { randomBytes } from "node:crypto"
import { Prisma } from "@prisma/client"
import {
  buildWeeklyReportMarkdown,
  calculateDeepWorkMinutes,
  calculateMethodStats,
  calculateRevenueAttempts,
  calculateShippedOutputs,
  getAccountabilityTemplate,
  hasProAccess,
  validateFieldValue,
  type AccountabilityFieldType,
} from "@founderbox/core"
import { prisma } from "./prisma"

type JsonRecord = Record<string, unknown>

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

export function startOfDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export function endOfDay(date = new Date()) {
  const start = startOfDay(date)
  return new Date(start.getTime() + 24 * 60 * 60 * 1000)
}

export function startOfWeek(date = new Date()) {
  const base = startOfDay(date)
  const day = base.getUTCDay()
  const diff = day === 0 ? 6 : day - 1
  return new Date(base.getTime() - diff * 24 * 60 * 60 * 1000)
}

function slugPart(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "workspace"
}

function shareToken() {
  return randomBytes(24).toString("base64url")
}

export async function ensureDefaultPlans() {
  await prisma.plan.upsert({
    where: { slug: "free" },
    update: {
      name: "Free",
      priceCents: 0,
      limits: {
        workspaces: 1,
        activeFlows: 1,
        historyDays: 30,
        shareReportsPerMonth: 3,
        accountabilityMcpCallsPerDay: 50,
      },
    },
    create: {
      slug: "free",
      name: "Free",
      priceCents: 0,
      limits: {
        workspaces: 1,
        activeFlows: 1,
        historyDays: 30,
        shareReportsPerMonth: 3,
        accountabilityMcpCallsPerDay: 50,
      },
    },
  })

  await prisma.plan.upsert({
    where: { slug: "founding-pro" },
    update: {
      name: "Founding Pro",
      priceCents: Number(process.env.FOUNDERBOX_PRO_PRICE_USD || 8) * 100,
      limits: {
        workspaces: 1,
        activeFlows: "unlimited",
        historyDays: "unlimited",
        shareReportsPerMonth: "unlimited",
        accountabilityMcpCallsPerDay: 1000,
      },
    },
    create: {
      slug: "founding-pro",
      name: "Founding Pro",
      priceCents: Number(process.env.FOUNDERBOX_PRO_PRICE_USD || 8) * 100,
      limits: {
        workspaces: 1,
        activeFlows: "unlimited",
        historyDays: "unlimited",
        shareReportsPerMonth: "unlimited",
        accountabilityMcpCallsPerDay: 1000,
      },
    },
  })
}

export async function installFlowTemplate(workspaceId: string, templateKey = process.env.FOUNDERBOX_DEFAULT_FLOW_TEMPLATE || "solo-dev") {
  const template = getAccountabilityTemplate(templateKey)

  return prisma.$transaction(async (tx) => {
    const flow = await tx.flow.create({
      data: {
        workspaceId,
        templateKey: template.key,
        name: template.name,
        persona: template.persona,
        description: template.description,
      },
    })

    await tx.flowVersion.create({
      data: {
        flowId: flow.id,
        version: 1,
        config: json(template),
      },
    })

    const objectIds = new Map<string, string>()
    const createdObjects = await Promise.all(
      template.objects.map((object, index) =>
        tx.flowObject.create({
          data: {
            flowId: flow.id,
            key: object.key,
            name: object.name,
            description: object.description,
            icon: object.icon,
            sortOrder: index,
          },
        })
      )
    )

    for (const [index, object] of template.objects.entries()) {
      objectIds.set(object.key, createdObjects[index].id)
    }

    const fieldCreatePromises: Promise<unknown>[] = []
    for (const object of template.objects) {
      const objectId = objectIds.get(object.key)
      if (!objectId) continue

      for (const [index, field] of object.fields.entries()) {
        const targetObjectKey = typeof field.settings?.objectKey === "string" ? field.settings.objectKey : undefined
        fieldCreatePromises.push(
          tx.flowField.create({
            data: {
              objectId,
              targetObjectId: targetObjectKey ? objectIds.get(targetObjectKey) : undefined,
              key: field.key,
              name: field.name,
              type: field.type,
              required: Boolean(field.required),
              settings: json(field.settings || {}),
              sortOrder: index,
              options: {
                create: (field.options || []).map((option, optionIndex) => ({
                  label: option,
                  value: option,
                  sortOrder: optionIndex,
                })),
              },
            },
          })
        )
      }
    }
    await Promise.all(fieldCreatePromises)

    const otherPromises: Promise<unknown>[] = []

    for (const view of template.views) {
      otherPromises.push(
        tx.flowView.create({
          data: {
            flowId: flow.id,
            objectId: view.objectKey ? objectIds.get(view.objectKey) : undefined,
            name: view.name,
            type: view.type,
            config: json(view.config),
          },
        })
      )
    }

    const dashboard = await tx.dashboard.create({
      data: {
        workspaceId,
        flowId: flow.id,
        name: `${template.name} Dashboard`,
        config: json({ templateKey: template.key }),
      },
    })

    for (const [index, widget] of template.dashboardWidgets.entries()) {
      otherPromises.push(
        tx.dashboardWidget.create({
          data: {
            dashboardId: dashboard.id,
            title: widget.title,
            type: widget.type,
            config: json(widget.config),
            sortOrder: index,
          },
        })
      )
    }

    const now = startOfWeek()
    for (const target of template.targets) {
      otherPromises.push(
        tx.target.create({
          data: {
            workspaceId,
            flowId: flow.id,
            metricKey: target.metricKey,
            name: target.name,
            period: target.period,
            targetValue: target.targetValue,
            unit: target.unit,
            startsAt: now,
          },
        })
      )
    }

    for (const metric of template.metrics) {
      otherPromises.push(
        tx.metricDefinition.upsert({
          where: { workspaceId_key: { workspaceId, key: metric.key } },
          update: {
            name: metric.name,
            type: metric.type,
            description: metric.description,
            config: json(metric.config),
            flowId: flow.id,
          },
          create: {
            workspaceId,
            flowId: flow.id,
            key: metric.key,
            name: metric.name,
            type: metric.type,
            description: metric.description,
            config: json(metric.config),
          },
        })
      )
    }

    await Promise.all(otherPromises)

    return flow
  }, {
    maxWait: 15000,
    timeout: 45000
  })
}

export async function ensureWorkspaceForUser(user: { id: string; email: string; name?: string | null }) {
  const existing = await prisma.workspaceMember.findFirst({
    where: { userId: user.id },
    include: { workspace: { include: { flows: { where: { archivedAt: null }, take: 1 } } } },
    orderBy: { createdAt: "asc" },
  })

  if (existing) {
    if (existing.workspace.flows.length === 0) await installFlowTemplate(existing.workspace.id)
    return existing.workspace
  }

  await ensureDefaultPlans()
  const workspace = await prisma.workspace.create({
    data: {
      name: `${user.name || user.email.split("@")[0]}'s FounderBox`,
      slug: `${slugPart(user.email.split("@")[0])}-${randomBytes(3).toString("hex")}`,
      ownerUserId: user.id,
      members: { create: { userId: user.id, role: "owner" } },
    },
  })

  await installFlowTemplate(workspace.id)
  return workspace
}

export async function getUserPlan(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
    include: { plan: true },
    orderBy: { updatedAt: "desc" },
  })

  return hasProAccess(subscription) ? "founding-pro" : "free"
}

async function findObject(workspaceId: string, objectKey: string) {
  const object = await prisma.flowObject.findFirst({
    where: {
      key: objectKey,
      archivedAt: null,
      flow: { workspaceId, archivedAt: null, isActive: true },
    },
    include: { fields: { where: { archivedAt: null }, orderBy: { sortOrder: "asc" } }, flow: true },
  })

  if (!object) throw new Error(`Flow object not found: ${objectKey}`)
  return object
}

export async function createAccountabilityEntry(input: {
  workspaceId: string
  userId?: string
  objectKey: string
  systemType: string
  title?: string
  summary?: string
  happenedAt?: Date
  values: JsonRecord
}) {
  const object = await findObject(input.workspaceId, input.objectKey)
  const fieldByKey = new Map(object.fields.map((field) => [field.key, field]))

  for (const [key, value] of Object.entries(input.values)) {
    const field = fieldByKey.get(key)
    if (!field) continue
    const validation = validateFieldValue(field.type as AccountabilityFieldType, value)
    if (!validation.valid) throw new Error(`${field.name}: ${validation.message}`)
  }

  return prisma.entry.create({
    data: {
      workspaceId: input.workspaceId,
      flowId: object.flowId,
      objectId: object.id,
      createdById: input.userId,
      systemType: input.systemType,
      title: input.title,
      summary: input.summary,
      happenedAt: input.happenedAt || new Date(),
      data: json(input.values),
      values: {
        create: Object.entries(input.values)
          .filter(([key, value]) => fieldByKey.has(key) && value !== undefined)
          .map(([key, value]) => ({
            fieldId: fieldByKey.get(key)!.id,
            value: json(value),
          })),
      },
    },
    include: { proofAssets: true },
  })
}

export async function logProof(input: {
  workspaceId: string
  userId?: string
  entryId?: string
  type?: string
  label?: string
  url?: string
  text?: string
  fileName?: string
  mimeType?: string
  sizeBytes?: number
  metadata?: JsonRecord
}) {
  const proof = await prisma.proofAsset.create({
    data: {
      workspaceId: input.workspaceId,
      userId: input.userId,
      entryId: input.entryId,
      type: input.type || "other",
      label: input.label,
      url: input.url,
      text: input.text,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      metadata: input.metadata ? json(input.metadata) : undefined,
    },
  })

  if (!input.entryId) {
    await createAccountabilityEntry({
      workspaceId: input.workspaceId,
      userId: input.userId,
      objectKey: "proof_assets",
      systemType: "proof",
      title: input.label || input.type || "Proof",
      values: {
        type: proof.type,
        label: proof.label,
        url: proof.url,
        text: proof.text,
        file_name: proof.fileName,
      },
    })
  }

  return proof
}

export async function upsertDailyReview(input: {
  workspaceId: string
  userId: string
  date?: Date
  wakeUpTime?: string
  mood?: string
  energy?: number
  mainGoal?: string
  revenueTaskDone?: boolean
  productTaskDone?: boolean
  distributionTaskDone?: boolean
  deepWorkMinutes?: number
  biggestOutput?: string
  methodWorked?: string
  vanished?: string
  endOfDayReview?: string
  data?: JsonRecord
}) {
  const date = startOfDay(input.date || new Date())
  return prisma.dailyReview.upsert({
    where: { workspaceId_userId_date: { workspaceId: input.workspaceId, userId: input.userId, date } },
    update: {
      wakeUpTime: input.wakeUpTime,
      mood: input.mood,
      energy: input.energy,
      mainGoal: input.mainGoal,
      revenueTaskDone: input.revenueTaskDone,
      productTaskDone: input.productTaskDone,
      distributionTaskDone: input.distributionTaskDone,
      deepWorkMinutes: input.deepWorkMinutes,
      biggestOutput: input.biggestOutput,
      methodWorked: input.methodWorked,
      vanished: input.vanished,
      endOfDayReview: input.endOfDayReview,
      data: input.data ? json(input.data) : undefined,
    },
    create: {
      workspaceId: input.workspaceId,
      userId: input.userId,
      date,
      wakeUpTime: input.wakeUpTime,
      mood: input.mood,
      energy: input.energy,
      mainGoal: input.mainGoal,
      revenueTaskDone: Boolean(input.revenueTaskDone),
      productTaskDone: Boolean(input.productTaskDone),
      distributionTaskDone: Boolean(input.distributionTaskDone),
      deepWorkMinutes: input.deepWorkMinutes || 0,
      biggestOutput: input.biggestOutput,
      methodWorked: input.methodWorked,
      vanished: input.vanished,
      endOfDayReview: input.endOfDayReview,
      data: input.data ? json(input.data) : undefined,
    },
  })
}

async function entriesForRange(workspaceId: string, from: Date, to: Date) {
  return prisma.entry.findMany({
    where: { workspaceId, archivedAt: null, happenedAt: { gte: from, lt: to } },
    include: { proofAssets: true, object: true },
    orderBy: { happenedAt: "desc" },
  })
}

export async function getTodaySnapshot(user: { id: string; email: string; name?: string | null }) {
  const workspace = await ensureWorkspaceForUser(user)
  const from = startOfDay()
  const to = endOfDay()
  const [entries, review, proofAssets, targets] = await Promise.all([
    entriesForRange(workspace.id, from, to),
    prisma.dailyReview.findUnique({ where: { workspaceId_userId_date: { workspaceId: workspace.id, userId: user.id, date: from } } }),
    prisma.proofAsset.findMany({ where: { workspaceId: workspace.id, capturedAt: { gte: from, lt: to } }, orderBy: { capturedAt: "desc" }, take: 20 }),
    prisma.target.findMany({ where: { workspaceId: workspace.id, startsAt: { lte: new Date() }, OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] } }),
  ])

  return {
    workspace,
    date: from,
    review,
    entries,
    proofAssets,
    targets,
    metrics: {
      revenueAttempts: calculateRevenueAttempts(entries),
      shippedOutputs: calculateShippedOutputs(entries),
      deepWorkMinutes: calculateDeepWorkMinutes(entries),
      methods: calculateMethodStats(entries),
    },
  }
}

export async function getWeeklySnapshot(user: { id: string; email: string; name?: string | null }, date = new Date()) {
  const workspace = await ensureWorkspaceForUser(user)
  const from = startOfWeek(date)
  const to = new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000)
  const [entries, dailyReviews] = await Promise.all([
    entriesForRange(workspace.id, from, to),
    prisma.dailyReview.findMany({ where: { workspaceId: workspace.id, userId: user.id, date: { gte: from, lt: to } }, orderBy: { date: "asc" } }),
  ])

  const metrics = {
    revenueAttempts: calculateRevenueAttempts(entries),
    shippedOutputs: calculateShippedOutputs(entries),
    deepWorkMinutes: calculateDeepWorkMinutes(entries),
    methods: calculateMethodStats(entries),
  }
  const markdown = buildWeeklyReportMarkdown({ weekStart: from, entries, dailyReviews })

  const weeklyReview = await prisma.weeklyReview.upsert({
    where: { workspaceId_userId_weekStart: { workspaceId: workspace.id, userId: user.id, weekStart: from } },
    update: { markdown, metrics: json(metrics) },
    create: { workspaceId: workspace.id, userId: user.id, weekStart: from, markdown, metrics: json(metrics) },
  })

  return { workspace, weekStart: from, weekEnd: to, entries, dailyReviews, metrics, markdown, weeklyReview }
}

export async function createShareReport(user: { id: string; email: string; name?: string | null }, input: { title?: string; weekStart?: Date; redacted?: boolean; expiresAt?: Date }) {
  const weekly = await getWeeklySnapshot(user, input.weekStart)
  return prisma.shareLink.create({
    data: {
      workspaceId: weekly.workspace.id,
      createdById: user.id,
      weeklyReviewId: weekly.weeklyReview.id,
      token: shareToken(),
      title: input.title || `Weekly proof report ${weekly.weekStart.toISOString().slice(0, 10)}`,
      redacted: input.redacted ?? true,
      expiresAt: input.expiresAt,
      scope: json({ type: "weekly_review", weekStart: weekly.weekStart.toISOString() }),
    },
  })
}


export interface DailyActivity {
  date: Date
  label: string
  count: number
  revenueAttempts: number
  shippedOutputs: number
}

/** Returns per-day activity for the last `days` days (oldest first), plus the current streak. */
export async function getActivitySeries(workspaceId: string, days = 14): Promise<{ series: DailyActivity[]; streak: number }> {
  const today = startOfDay()
  const from = new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  const entries = await prisma.entry.findMany({
    where: { workspaceId, archivedAt: null, happenedAt: { gte: from } },
    select: { happenedAt: true, systemType: true },
  })

  const buckets = new Map<string, DailyActivity>()
  for (let i = 0; i < days; i++) {
    const date = new Date(from.getTime() + i * 24 * 60 * 60 * 1000)
    const key = date.toISOString().slice(0, 10)
    buckets.set(key, {
      date,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      count: 0,
      revenueAttempts: 0,
      shippedOutputs: 0,
    })
  }

  const revenueTypes = new Set(["outreach", "lead", "deal", "proposal"])
  const outputTypes = new Set(["work", "product", "proof", "deploy"])

  for (const entry of entries) {
    const key = startOfDay(entry.happenedAt).toISOString().slice(0, 10)
    const bucket = buckets.get(key)
    if (!bucket) continue
    bucket.count += 1
    if (revenueTypes.has(entry.systemType || "")) bucket.revenueAttempts += 1
    if (outputTypes.has(entry.systemType || "")) bucket.shippedOutputs += 1
  }

  const series = Array.from(buckets.values())

  // Streak: count back from today (or yesterday if nothing logged yet today) while days have activity.
  let streak = 0
  for (let i = series.length - 1; i >= 0; i--) {
    const isToday = i === series.length - 1
    if (series[i].count > 0) {
      streak += 1
    } else if (isToday) {
      // Allow today to be empty without breaking an existing streak.
      continue
    } else {
      break
    }
  }

  return { series, streak }
}

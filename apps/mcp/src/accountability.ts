import { randomBytes } from "node:crypto"
import { Prisma } from "@prisma/client"
import {
  buildWeeklyReportMarkdown,
  calculateDeepWorkMinutes,
  calculateMethodStats,
  calculateRevenueAttempts,
  calculateShippedOutputs,
  getAccountabilityTemplate,
} from "@founderbox/core"
import { prisma } from "./db.js"

type JsonRecord = Record<string, unknown>

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

function startOfDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function endOfDay(date = new Date()) {
  const start = startOfDay(date)
  return new Date(start.getTime() + 24 * 60 * 60 * 1000)
}

function startOfWeek(date = new Date()) {
  const base = startOfDay(date)
  const day = base.getUTCDay()
  const diff = day === 0 ? 6 : day - 1
  return new Date(base.getTime() - diff * 24 * 60 * 60 * 1000)
}

async function installTemplate(workspaceId: string, templateKey = "solo-dev") {
  const template = getAccountabilityTemplate(templateKey)
  return prisma.$transaction(async (tx) => {
    const flow = await tx.flow.create({
      data: { workspaceId, templateKey: template.key, name: template.name, persona: template.persona, description: template.description },
    })
    await tx.flowVersion.create({ data: { flowId: flow.id, version: 1, config: json(template) } })

    const objectIds = new Map<string, string>()
    for (const [index, object] of template.objects.entries()) {
      const created = await tx.flowObject.create({
        data: { flowId: flow.id, key: object.key, name: object.name, description: object.description, icon: object.icon, sortOrder: index },
      })
      objectIds.set(object.key, created.id)
    }

    for (const object of template.objects) {
      const objectId = objectIds.get(object.key)
      if (!objectId) continue
      for (const [index, field] of object.fields.entries()) {
        const targetObjectKey = typeof field.settings?.objectKey === "string" ? field.settings.objectKey : undefined
        const created = await tx.flowField.create({
          data: {
            objectId,
            targetObjectId: targetObjectKey ? objectIds.get(targetObjectKey) : undefined,
            key: field.key,
            name: field.name,
            type: field.type,
            required: Boolean(field.required),
            settings: json(field.settings || {}),
            sortOrder: index,
          },
        })
        for (const [optionIndex, option] of (field.options || []).entries()) {
          await tx.flowFieldOption.create({ data: { fieldId: created.id, label: option, value: option, sortOrder: optionIndex } })
        }
      }
    }

    for (const metric of template.metrics) {
      await tx.metricDefinition.create({
        data: { workspaceId, flowId: flow.id, key: metric.key, name: metric.name, type: metric.type, description: metric.description, config: json(metric.config) },
      })
    }
    return flow
  }, {
    maxWait: 15000,
    timeout: 30000
  })
}

export async function ensureAccountabilityWorkspace(userId: string) {
  if (userId === "dev-user") throw new Error("Accountability MCP tools require an authenticated FounderBox API key.")
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error("FounderBox user not found.")

  const member = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: { workspace: { include: { flows: { where: { archivedAt: null }, take: 1 } } } },
    orderBy: { createdAt: "asc" },
  })
  if (member) {
    if (member.workspace.flows.length === 0) await installTemplate(member.workspace.id)
    return member.workspace
  }

  const workspace = await prisma.workspace.create({
    data: {
      name: `${user.name || user.email.split("@")[0]}'s FounderBox`,
      slug: `${user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${randomBytes(3).toString("hex")}`,
      ownerUserId: user.id,
      members: { create: { userId: user.id, role: "owner" } },
    },
  })
  await installTemplate(workspace.id)
  return workspace
}

async function findObject(workspaceId: string, objectKey: string) {
  const object = await prisma.flowObject.findFirst({
    where: { key: objectKey, archivedAt: null, flow: { workspaceId, archivedAt: null, isActive: true } },
    include: { fields: true },
  })
  if (!object) throw new Error(`Flow object not found: ${objectKey}`)
  return object
}

export async function createAccountabilityEntryForUser(userId: string, input: { objectKey: string; systemType: string; title?: string; summary?: string; values: JsonRecord }) {
  const workspace = await ensureAccountabilityWorkspace(userId)
  const object = await findObject(workspace.id, input.objectKey)
  const fieldByKey = new Map(object.fields.map((field) => [field.key, field]))
  return prisma.entry.create({
    data: {
      workspaceId: workspace.id,
      flowId: object.flowId,
      objectId: object.id,
      createdById: userId,
      systemType: input.systemType,
      title: input.title,
      summary: input.summary,
      data: json(input.values),
      values: {
        create: Object.entries(input.values)
          .filter(([key, value]) => fieldByKey.has(key) && value !== undefined)
          .map(([key, value]) => ({ fieldId: fieldByKey.get(key)!.id, value: json(value) })),
      },
    },
    include: { proofAssets: true },
  })
}

export async function logProofForUser(userId: string, input: { entryId?: string; type?: string; label?: string; url?: string; text?: string }) {
  const workspace = await ensureAccountabilityWorkspace(userId)
  return prisma.proofAsset.create({
    data: { workspaceId: workspace.id, userId, entryId: input.entryId, type: input.type || "other", label: input.label, url: input.url, text: input.text },
  })
}

export async function upsertReviewForUser(userId: string, input: JsonRecord) {
  const workspace = await ensureAccountabilityWorkspace(userId)
  const date = startOfDay()
  return prisma.dailyReview.upsert({
    where: { workspaceId_userId_date: { workspaceId: workspace.id, userId, date } },
    update: {
      mainGoal: input.mainGoal as string | undefined,
      wakeUpTime: input.wakeUpTime as string | undefined,
      mood: input.mood as string | undefined,
      energy: input.energy == null ? undefined : Number(input.energy),
      biggestOutput: input.biggestOutput as string | undefined,
      methodWorked: input.methodWorked as string | undefined,
      vanished: input.vanished as string | undefined,
      endOfDayReview: input.endOfDayReview as string | undefined,
      data: json(input),
    },
    create: {
      workspaceId: workspace.id,
      userId,
      date,
      mainGoal: input.mainGoal as string | undefined,
      wakeUpTime: input.wakeUpTime as string | undefined,
      mood: input.mood as string | undefined,
      energy: input.energy == null ? undefined : Number(input.energy),
      biggestOutput: input.biggestOutput as string | undefined,
      methodWorked: input.methodWorked as string | undefined,
      vanished: input.vanished as string | undefined,
      endOfDayReview: input.endOfDayReview as string | undefined,
      data: json(input),
    },
  })
}

export async function getTodayForUser(userId: string) {
  const workspace = await ensureAccountabilityWorkspace(userId)
  const from = startOfDay()
  const to = endOfDay()
  const entries = await prisma.entry.findMany({
    where: { workspaceId: workspace.id, archivedAt: null, happenedAt: { gte: from, lt: to } },
    include: { proofAssets: true, object: true },
    orderBy: { happenedAt: "desc" },
  })
  return {
    date: from,
    workspace: { id: workspace.id, name: workspace.name },
    metrics: {
      revenueAttempts: calculateRevenueAttempts(entries),
      shippedOutputs: calculateShippedOutputs(entries),
      deepWorkMinutes: calculateDeepWorkMinutes(entries),
      methods: calculateMethodStats(entries),
    },
    entries,
  }
}

export async function getWeeklyReportForUser(userId: string, date = new Date()) {
  const workspace = await ensureAccountabilityWorkspace(userId)
  const from = startOfWeek(date)
  const to = new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000)
  const [entries, dailyReviews] = await Promise.all([
    prisma.entry.findMany({ where: { workspaceId: workspace.id, archivedAt: null, happenedAt: { gte: from, lt: to } }, include: { proofAssets: true } }),
    prisma.dailyReview.findMany({ where: { workspaceId: workspace.id, userId, date: { gte: from, lt: to } }, orderBy: { date: "asc" } }),
  ])
  const markdown = buildWeeklyReportMarkdown({ weekStart: from, entries, dailyReviews })
  const metrics = {
    revenueAttempts: calculateRevenueAttempts(entries),
    shippedOutputs: calculateShippedOutputs(entries),
    deepWorkMinutes: calculateDeepWorkMinutes(entries),
    methods: calculateMethodStats(entries),
  }
  const weeklyReview = await prisma.weeklyReview.upsert({
    where: { workspaceId_userId_weekStart: { workspaceId: workspace.id, userId, weekStart: from } },
    update: { markdown, metrics: json(metrics) },
    create: { workspaceId: workspace.id, userId, weekStart: from, markdown, metrics: json(metrics) },
  })
  return { weekStart: from, weekEnd: to, metrics, markdown, weeklyReview }
}

export async function createShareReportForUser(userId: string) {
  const workspace = await ensureAccountabilityWorkspace(userId)
  const report = await getWeeklyReportForUser(userId)
  const shareLink = await prisma.shareLink.create({
    data: {
      workspaceId: workspace.id,
      createdById: userId,
      weeklyReviewId: report.weeklyReview.id,
      token: randomBytes(24).toString("base64url"),
      title: `Weekly proof report ${report.weekStart.toISOString().slice(0, 10)}`,
      scope: json({ type: "weekly_review", weekStart: report.weekStart.toISOString() }),
    },
  })
  return { shareLink, url: `${process.env.FOUNDERBOX_WEB_URL || "http://localhost:3000"}/share/${shareLink.token}` }
}

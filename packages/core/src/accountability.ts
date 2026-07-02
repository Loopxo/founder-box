export const ACCOUNTABILITY_FIELD_TYPES = [
  "text",
  "longText",
  "number",
  "currency",
  "boolean",
  "date",
  "datetime",
  "duration",
  "url",
  "singleSelect",
  "multiSelect",
  "relation",
  "rating",
  "file",
] as const

export type AccountabilityFieldType = (typeof ACCOUNTABILITY_FIELD_TYPES)[number]

export const PROOF_TYPES = ["commit", "deploy", "message", "proposal", "design", "content", "bugfix", "other"] as const
export type ProofType = (typeof PROOF_TYPES)[number]

export const LEAD_STATUSES = ["New", "Contacted", "Replied", "Call Booked", "Proposal Sent", "Closed", "Declined", "Dead"] as const
export const WORK_TYPES = ["Client Work", "Product", "Outreach", "Learning", "Admin", "Content"] as const
export const PRODUCT_STAGES = ["Idea", "Building", "Testing", "Deployed", "Used by Real User"] as const

export interface FlowFieldSeed {
  key: string
  name: string
  type: AccountabilityFieldType
  required?: boolean
  options?: string[]
  settings?: Record<string, unknown>
}

export interface FlowObjectSeed {
  key: string
  name: string
  description: string
  icon?: string
  fields: FlowFieldSeed[]
}

export interface FlowTemplateSeed {
  key: string
  name: string
  persona: string
  description: string
  objects: FlowObjectSeed[]
  views: Array<{ name: string; type: string; objectKey?: string; config: Record<string, unknown> }>
  dashboardWidgets: Array<{ title: string; type: string; config: Record<string, unknown> }>
  targets: Array<{ metricKey: string; name: string; period: string; targetValue: number; unit?: string }>
  metrics: Array<{ key: string; name: string; type: string; description: string; config: Record<string, unknown> }>
}

const dailyCheckIn: FlowObjectSeed = {
  key: "daily_checkins",
  name: "Daily Check-ins",
  description: "Morning intent and end-of-day truth for one operator.",
  icon: "calendar-check",
  fields: [
    { key: "date", name: "Date", type: "date", required: true },
    { key: "wake_up_time", name: "Wake-up time", type: "text" },
    { key: "mood", name: "Mood", type: "singleSelect", options: ["Low", "Okay", "Good", "Sharp"] },
    { key: "energy", name: "Energy", type: "rating", settings: { max: 5 } },
    { key: "main_goal", name: "Main goal today", type: "longText" },
    { key: "revenue_task_done", name: "Revenue task done", type: "boolean" },
    { key: "product_task_done", name: "Product task done", type: "boolean" },
    { key: "distribution_task_done", name: "Distribution task done", type: "boolean" },
    { key: "deep_work_minutes", name: "Deep work minutes", type: "duration" },
    { key: "end_of_day_review", name: "End-of-day review", type: "longText" },
  ],
}

const leads: FlowObjectSeed = {
  key: "leads",
  name: "Leads",
  description: "People and companies that may become revenue.",
  icon: "users",
  fields: [
    { key: "client_name", name: "Client name", type: "text", required: true },
    { key: "business_type", name: "Business type", type: "text" },
    { key: "country", name: "Country", type: "text" },
    { key: "source", name: "Source", type: "singleSelect", options: ["LinkedIn", "Instagram", "WhatsApp", "Referral", "Cold Email", "Other"] },
    { key: "status", name: "Status", type: "singleSelect", required: true, options: [...LEAD_STATUSES] },
    { key: "potential_value", name: "Potential value", type: "currency" },
    { key: "next_follow_up_date", name: "Next follow-up date", type: "date" },
    { key: "notes", name: "Notes", type: "longText" },
  ],
}

const methods: FlowObjectSeed = {
  key: "methods",
  name: "Methods Library",
  description: "Reusable outreach and work methods with outcomes.",
  icon: "flask-conical",
  fields: [
    { key: "method_name", name: "Method name", type: "text", required: true },
    { key: "description", name: "Description", type: "longText" },
    { key: "example_message", name: "Example message", type: "longText" },
    { key: "target_business_type", name: "Target business type", type: "text" },
    { key: "effort_level", name: "Effort level", type: "singleSelect", options: ["Low", "Medium", "High"] },
    { key: "used_count", name: "Used count", type: "number" },
    { key: "reply_count", name: "Reply count", type: "number" },
    { key: "close_count", name: "Close count", type: "number" },
    { key: "notes", name: "Notes", type: "longText" },
  ],
}

const outreachLog: FlowObjectSeed = {
  key: "outreach_log",
  name: "Outreach Log",
  description: "Every message, call, follow-up, offer, and outcome.",
  icon: "send",
  fields: [
    { key: "date", name: "Date", type: "date", required: true },
    { key: "lead", name: "Lead", type: "relation", settings: { objectKey: "leads" } },
    { key: "channel", name: "Channel", type: "singleSelect", options: ["LinkedIn", "Email", "Instagram", "WhatsApp", "Call", "Other"] },
    { key: "message_used", name: "Message used", type: "longText" },
    { key: "method_used", name: "Method used", type: "text" },
    { key: "personalization_level", name: "Personalization level", type: "singleSelect", options: ["Low", "Medium", "High"] },
    { key: "offer_sent", name: "Offer sent", type: "text" },
    { key: "reply", name: "Reply", type: "boolean" },
    { key: "outcome", name: "Outcome", type: "singleSelect", options: ["Sent", "Follow-up", "Replied", "Call Booked", "Proposal Sent", "Closed", "Declined", "No Response"] },
    { key: "follow_up_required", name: "Follow-up required", type: "boolean" },
  ],
}

const workSessions: FlowObjectSeed = {
  key: "work_sessions",
  name: "Work Sessions",
  description: "Focused work blocks with an output requirement.",
  icon: "timer",
  fields: [
    { key: "date", name: "Date", type: "date", required: true },
    { key: "start_time", name: "Start time", type: "datetime" },
    { key: "end_time", name: "End time", type: "datetime" },
    { key: "duration_minutes", name: "Duration minutes", type: "duration" },
    { key: "project", name: "Project", type: "text" },
    { key: "type", name: "Type", type: "singleSelect", options: [...WORK_TYPES] },
    { key: "output_created", name: "Output created", type: "longText" },
    { key: "valuable", name: "Was it valuable", type: "boolean" },
    { key: "proof_link", name: "Proof link", type: "url" },
  ],
}

const productProgress: FlowObjectSeed = {
  key: "product_progress",
  name: "Product Progress",
  description: "Real movement on products, features, deployments, users, and blockers.",
  icon: "rocket",
  fields: [
    { key: "product", name: "Product", type: "text", required: true },
    { key: "feature_worked_on", name: "Feature worked on", type: "text" },
    { key: "stage", name: "Stage", type: "singleSelect", options: [...PRODUCT_STAGES] },
    { key: "users_affected", name: "Users affected", type: "number" },
    { key: "proof_link", name: "Proof link", type: "url" },
    { key: "blocker", name: "Blocker", type: "longText" },
    { key: "next_action", name: "Next action", type: "longText" },
  ],
}

const proofAssets: FlowObjectSeed = {
  key: "proof_assets",
  name: "Proof Assets",
  description: "Links, screenshots, files, and notes proving actual output.",
  icon: "paperclip",
  fields: [
    { key: "type", name: "Type", type: "singleSelect", options: [...PROOF_TYPES] },
    { key: "label", name: "Label", type: "text" },
    { key: "url", name: "URL", type: "url" },
    { key: "text", name: "Text proof", type: "longText" },
    { key: "file_name", name: "File name", type: "file" },
  ],
}

const reviews: FlowObjectSeed[] = [
  {
    key: "daily_reviews",
    name: "Daily Reviews",
    description: "What moved, what vanished, and what method worked today.",
    icon: "notebook-pen",
    fields: [
      { key: "date", name: "Date", type: "date", required: true },
      { key: "biggest_output", name: "Biggest output today", type: "longText" },
      { key: "method_worked", name: "What method worked today", type: "longText" },
      { key: "vanished", name: "What vanished today", type: "longText" },
      { key: "review", name: "Review", type: "longText" },
    ],
  },
  {
    key: "weekly_reviews",
    name: "Weekly Reviews",
    description: "Weekly proof reports built from logged actions.",
    icon: "chart-no-axes-combined",
    fields: [
      { key: "week_start", name: "Week start", type: "date", required: true },
      { key: "summary", name: "Summary", type: "longText" },
      { key: "best_method", name: "Best method", type: "text" },
      { key: "revenue_attempts", name: "Revenue attempts", type: "number" },
      { key: "shipped_outputs", name: "Shipped outputs", type: "number" },
    ],
  },
  {
    key: "targets",
    name: "Targets",
    description: "Weekly targets for attempts, shipped outputs, and focus.",
    icon: "target",
    fields: [
      { key: "metric", name: "Metric", type: "text", required: true },
      { key: "period", name: "Period", type: "singleSelect", options: ["Day", "Week", "Month"] },
      { key: "target_value", name: "Target value", type: "number", required: true },
      { key: "unit", name: "Unit", type: "text" },
    ],
  },
]

const defaultObjects = [dailyCheckIn, leads, outreachLog, methods, workSessions, productProgress, proofAssets, ...reviews]

function makeTemplate(key: string, name: string, persona: string, description: string, targetOverrides: Partial<FlowTemplateSeed["targets"][number]>[] = []): FlowTemplateSeed {
  const baseTargets = [
    { metricKey: "revenue_attempts", name: "Revenue attempts", period: "week", targetValue: 25, unit: "attempts" },
    { metricKey: "shipped_outputs", name: "Shipped outputs", period: "week", targetValue: 3, unit: "outputs" },
    { metricKey: "deep_work_minutes", name: "Deep work", period: "week", targetValue: 600, unit: "minutes" },
  ]

  return {
    key,
    name,
    persona,
    description,
    objects: defaultObjects,
    views: [
      { name: "Today", type: "form", objectKey: "daily_checkins", config: { primary: true } },
      { name: "Outreach board", type: "table", objectKey: "outreach_log", config: { groupBy: "outcome" } },
      { name: "Work log", type: "table", objectKey: "work_sessions", config: { sort: "date:desc" } },
      { name: "Product timeline", type: "timeline", objectKey: "product_progress", config: { dateField: "createdAt" } },
      { name: "Proof feed", type: "feed", objectKey: "proof_assets", config: { sort: "capturedAt:desc" } },
    ],
    dashboardWidgets: [
      { title: "Revenue Attempts", type: "metric", config: { metricKey: "revenue_attempts" } },
      { title: "Shipped Outputs", type: "metric", config: { metricKey: "shipped_outputs" } },
      { title: "Best Method", type: "method", config: { sort: "win_rate" } },
      { title: "Deep Work", type: "duration", config: { metricKey: "deep_work_minutes" } },
      { title: "Proof Feed", type: "feed", config: { objectKey: "proof_assets" } },
    ],
    targets: baseTargets.map((target, index) => ({ ...target, ...(targetOverrides[index] || {}) })),
    metrics: [
      { key: "revenue_attempts", name: "Revenue Attempts", type: "counter", description: "Outreach, follow-ups, replies, calls, proposals, and closed deals.", config: { source: "outreach_log" } },
      { key: "shipped_outputs", name: "Shipped Outputs", type: "counter", description: "Work sessions and product progress with clear output or proof.", config: { sources: ["work_sessions", "product_progress", "proof_assets"] } },
      { key: "method_win_rate", name: "Method Win Rate", type: "ratio", description: "Closed deals divided by method usage.", config: { source: "outreach_log" } },
      { key: "proof_score", name: "Proof Score", type: "score", description: "Weighted score of proof completeness and shipped output.", config: { max: 100 } },
    ],
  }
}

export const ACCOUNTABILITY_FLOW_TEMPLATES: FlowTemplateSeed[] = [
  makeTemplate("solo-dev", "Solo Dev", "solo dev", "For builders who need proof of shipping, deep work, and customer attempts.", [{ targetValue: 15 }, { targetValue: 5 }, { targetValue: 900 }]),
  makeTemplate("indie-hacker", "Indie Hacker", "indie hacker", "For product experiments, launch loops, audience work, and shipped output.", [{ targetValue: 30 }, { targetValue: 4 }, { targetValue: 720 }]),
  makeTemplate("agency-owner", "Agency Owner", "agency owner", "For outreach methods, proposals, delivery blocks, and client pipeline proof.", [{ targetValue: 50 }, { targetValue: 3 }, { targetValue: 600 }]),
  makeTemplate("freelancer", "Freelancer", "freelancer", "For client outreach, billable delivery, follow-ups, and proof links.", [{ targetValue: 35 }, { targetValue: 4 }, { targetValue: 750 }]),
  makeTemplate("client-outreach-sprint", "Client Outreach Sprint", "operator", "A focused sprint to test offers, methods, replies, and booked calls.", [{ targetValue: 100 }, { targetValue: 1 }, { targetValue: 360 }]),
  makeTemplate("product-shipping-sprint", "Product Shipping Sprint", "builder", "A focused sprint to ship product changes and capture proof every day.", [{ targetValue: 10 }, { targetValue: 10 }, { targetValue: 1200 }]),
  makeTemplate("personal-discipline-reset", "Personal Discipline Reset", "solo operator", "A reset flow for daily check-ins, focused sessions, and honest reviews.", [{ targetValue: 10 }, { targetValue: 2 }, { targetValue: 600 }]),
]

export function getAccountabilityTemplate(templateKey = "solo-dev") {
  return ACCOUNTABILITY_FLOW_TEMPLATES.find((template) => template.key === templateKey) || ACCOUNTABILITY_FLOW_TEMPLATES[0]
}

export interface AccountabilityEntryLike {
  systemType?: string | null
  happenedAt?: string | Date
  title?: string | null
  data?: unknown
  proofAssets?: Array<Record<string, unknown>>
}

function toNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function normalizeOutcome(value: unknown) {
  return String(value || "").trim().toLowerCase()
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
}

function entryData(entry: AccountabilityEntryLike): Record<string, unknown> {
  return entry.data && typeof entry.data === "object" && !Array.isArray(entry.data) ? (entry.data as Record<string, unknown>) : {}
}

export function calculateRevenueAttempts(entries: AccountabilityEntryLike[]) {
  const result = {
    outreachSent: 0,
    followUps: 0,
    replies: 0,
    callsBooked: 0,
    proposalsSent: 0,
    dealsClosed: 0,
    total: 0,
  }

  for (const entry of entries) {
    if (entry.systemType !== "outreach") continue
    const data = entryData(entry)
    const outcome = normalizeOutcome(data.outcome)
    const eventType = normalizeOutcome(data.eventType || data.event_type)

    if (!eventType || eventType === "sent" || outcome === "sent") result.outreachSent += 1
    if (eventType.includes("follow") || outcome.includes("follow")) result.followUps += 1
    if (data.reply === true || outcome === "replied") result.replies += 1
    if (outcome === "call booked") result.callsBooked += 1
    if (outcome === "proposal sent") result.proposalsSent += 1
    if (outcome === "closed") result.dealsClosed += 1
  }

  result.total = result.outreachSent + result.followUps + result.replies + result.callsBooked + result.proposalsSent + result.dealsClosed
  return result
}

export function calculateShippedOutputs(entries: AccountabilityEntryLike[]) {
  let total = 0
  const byType: Record<string, number> = {}

  for (const entry of entries) {
    const data = entryData(entry)
    const proofCount = entry.proofAssets?.length || 0
    const outputType = String(data.outputType || data.output_type || data.type || entry.systemType || "other")
    const hasOutput = hasText(data.outputCreated) || hasText(data.output_created) || hasText(data.output) || hasText(data.proofLink) || hasText(data.proof_link) || proofCount > 0
    const stage = normalizeOutcome(data.stage)
    const stageCounts = stage === "deployed" || stage === "used by real user"

    if ((entry.systemType === "work_session" && hasOutput) || (entry.systemType === "product_progress" && (hasOutput || stageCounts)) || entry.systemType === "proof") {
      total += 1
      byType[outputType] = (byType[outputType] || 0) + 1
    }
  }

  return { total, byType }
}

export function calculateDeepWorkMinutes(entries: AccountabilityEntryLike[]) {
  return entries.reduce((sum, entry) => {
    if (entry.systemType !== "work_session") return sum
    const data = entryData(entry)
    return sum + toNumber(data.durationMinutes || data.duration_minutes)
  }, 0)
}

export function calculateMethodStats(entries: AccountabilityEntryLike[]) {
  const stats = new Map<string, { method: string; usedCount: number; replyCount: number; closeCount: number; winRate: number }>()

  for (const entry of entries) {
    if (entry.systemType !== "outreach") continue
    const data = entryData(entry)
    const method = String(data.methodUsed || data.method_used || data.methodName || data.method_name || "Unspecified method").trim()
    const current = stats.get(method) || { method, usedCount: 0, replyCount: 0, closeCount: 0, winRate: 0 }
    const outcome = normalizeOutcome(data.outcome)
    current.usedCount += 1
    if (data.reply === true || outcome === "replied" || outcome === "call booked" || outcome === "proposal sent" || outcome === "closed") current.replyCount += 1
    if (outcome === "closed") current.closeCount += 1
    current.winRate = current.usedCount ? current.closeCount / current.usedCount : 0
    stats.set(method, current)
  }

  return [...stats.values()].sort((a, b) => b.winRate - a.winRate || b.replyCount - a.replyCount || b.usedCount - a.usedCount)
}

export function calculateProofScore(entries: AccountabilityEntryLike[]) {
  const revenue = calculateRevenueAttempts(entries)
  const shipped = calculateShippedOutputs(entries)
  const proofCount = entries.reduce((sum, entry) => sum + (entry.proofAssets?.length || 0) + (entry.systemType === "proof" ? 1 : 0), 0)
  return Math.min(100, revenue.total * 2 + shipped.total * 10 + proofCount * 5)
}

export function validateFieldValue(type: AccountabilityFieldType, value: unknown) {
  if (value == null || value === "") return { valid: true }
  if (type === "number" || type === "currency" || type === "duration" || type === "rating") return { valid: Number.isFinite(Number(value)), message: "Expected a number." }
  if (type === "boolean") return { valid: typeof value === "boolean", message: "Expected true or false." }
  if (type === "url") return { valid: typeof value === "string" && /^https?:\/\//i.test(value), message: "Expected an http or https URL." }
  if (type === "date" || type === "datetime") return { valid: !Number.isNaN(Date.parse(String(value))), message: "Expected a valid date." }
  if (type === "multiSelect") return { valid: Array.isArray(value), message: "Expected an array." }
  return { valid: true }
}

export function getPlanLimits(plan: "free" | "founding-pro" | "pro" = "free") {
  if (plan === "founding-pro" || plan === "pro") {
    return {
      workspaces: 1,
      activeFlows: Number.POSITIVE_INFINITY,
      historyDays: Number.POSITIVE_INFINITY,
      shareReportsPerMonth: Number.POSITIVE_INFINITY,
      accountabilityMcpCallsPerDay: 1000,
      customDashboards: true,
      exports: true,
    }
  }

  return {
    workspaces: 1,
    activeFlows: 1,
    historyDays: 30,
    shareReportsPerMonth: 3,
    accountabilityMcpCallsPerDay: 50,
    customDashboards: false,
    exports: false,
  }
}

export function hasProAccess(subscription?: { status?: string | null; lemonVariantId?: string | null; plan?: { slug?: string | null } | null } | null) {
  if (!subscription) return false
  const active = ["active", "on_trial", "past_due"].includes(String(subscription.status || "").toLowerCase())
  const proPlan = subscription.plan?.slug === "founding-pro" || subscription.plan?.slug === "pro" || Boolean(subscription.lemonVariantId)
  return active && proPlan
}

export function buildWeeklyReportMarkdown(input: {
  weekStart: string | Date
  entries: AccountabilityEntryLike[]
  dailyReviews?: Array<{ date: string | Date; biggestOutput?: string | null; methodWorked?: string | null; vanished?: string | null; endOfDayReview?: string | null }>
}) {
  const revenue = calculateRevenueAttempts(input.entries)
  const shipped = calculateShippedOutputs(input.entries)
  const methods = calculateMethodStats(input.entries)
  const deepWorkMinutes = calculateDeepWorkMinutes(input.entries)
  const bestMethod = methods[0]
  const proofScore = calculateProofScore(input.entries)
  const week = new Date(input.weekStart).toISOString().slice(0, 10)

  const reviewLines = (input.dailyReviews || [])
    .map((review) => {
      const parts = [review.biggestOutput && `output: ${review.biggestOutput}`, review.methodWorked && `method: ${review.methodWorked}`, review.vanished && `vanished: ${review.vanished}`].filter(Boolean)
      return `- ${new Date(review.date).toISOString().slice(0, 10)}: ${parts.join("; ") || review.endOfDayReview || "No written review."}`
    })
    .join("\n")

  return `# FounderBox Weekly Proof Report

Week of ${week}

## Scorecard
- Revenue attempts: ${revenue.total}
- Shipped outputs: ${shipped.total}
- Deep work: ${Math.round(deepWorkMinutes / 60)}h ${deepWorkMinutes % 60}m
- Proof score: ${proofScore}/100
- Best method: ${bestMethod ? `${bestMethod.method} (${bestMethod.replyCount} replies, ${bestMethod.closeCount} closed)` : "No method data yet"}

## Revenue Attempts
- Outreach sent: ${revenue.outreachSent}
- Follow-ups: ${revenue.followUps}
- Replies: ${revenue.replies}
- Calls booked: ${revenue.callsBooked}
- Proposals sent: ${revenue.proposalsSent}
- Deals closed: ${revenue.dealsClosed}

## Shipped Outputs
${Object.entries(shipped.byType).map(([type, count]) => `- ${type}: ${count}`).join("\n") || "- No shipped outputs logged."}

## Daily Truth
${reviewLines || "- No daily reviews logged."}
`
}

export type FounderBoxPlanSlug = "free" | "founding-pro"

export interface FounderBoxUser {
  id: string
  email: string
  name?: string | null
  role?: string | null
}

export interface FounderBoxWorkspace {
  id: string
  name: string
  slug?: string | null
  persona?: string | null
}

export interface FounderBoxPlanStatus {
  plan: FounderBoxPlanSlug
  label: string
  isPro: boolean
}

export interface MobileMeResponse {
  user: FounderBoxUser
  workspace: FounderBoxWorkspace
  plan: FounderBoxPlanStatus
  notifications?: {
    dailyReminder: boolean
    weeklyReview: boolean
    reminderTime?: string | null
    timezone?: string | null
  } | null
}

export interface RequestOtpResponse {
  ok: true
  expiresAt: string
  devCode?: string
}

export interface VerifyOtpResponse {
  ok: true
  accessToken: string
  expiresAt: string
  user: FounderBoxUser
  workspace: FounderBoxWorkspace
  plan: FounderBoxPlanStatus
}

export interface MetricSnapshot {
  revenueAttempts: number
  shippedOutputs: number
  deepWorkMinutes: number
  methods?: Array<Record<string, unknown>>
  methodStats?: Array<Record<string, unknown>>
}

export interface TodaySnapshot {
  workspace: FounderBoxWorkspace
  date: string
  metrics: MetricSnapshot
  targets?: Array<Record<string, unknown>>
  entries?: Array<Record<string, unknown>>
  proofAssets?: Array<Record<string, unknown>>
  proofs?: Array<Record<string, unknown>>
  review?: Record<string, unknown> | null
}

export interface WeeklySnapshot {
  workspace: FounderBoxWorkspace
  weekStart: string
  weekEnd: string
  entries: Array<Record<string, unknown>>
  dailyReviews: Array<Record<string, unknown>>
  metrics: MetricSnapshot
  markdown: string
  weeklyReview?: Record<string, unknown>
}

export interface FlowSummary {
  id: string
  name: string
  description?: string | null
  persona?: string | null
  templateKey?: string | null
  isActive?: boolean
  objects?: Array<Record<string, unknown>>
  views?: Array<Record<string, unknown>>
}

export interface FlowsResponse {
  workspace: FounderBoxWorkspace
  flows: FlowSummary[]
}

export interface EntryResponse {
  entry: Record<string, unknown>
}

export interface ProofResponse {
  proof: Record<string, unknown>
}

export interface ApiKeysResponse {
  keys: Array<Record<string, unknown>>
  usage: Array<Record<string, unknown>>
}

export interface CreateApiKeyResponse {
  key: string
  apiKey: Record<string, unknown>
}

export interface SessionsResponse {
  currentSessionId?: string | null
  sessions: Array<Record<string, unknown>>
}

export interface CheckoutResponse {
  url: string
}

export interface ShareLinksResponse {
  shareLinks: Array<Record<string, unknown>>
}

export interface CreateShareLinkResponse {
  shareLink: Record<string, unknown>
  url: string
}

export interface LogOutreachInput {
  clientName?: string
  channel?: string
  messageUsed?: string
  methodUsed?: string
  personalizationLevel?: string
  offerSent?: string
  reply?: boolean
  outcome?: string
  followUpRequired?: boolean
}

export interface LogWorkSessionInput {
  project?: string
  startTime?: string
  endTime?: string
  durationMinutes?: number
  type?: string
  outputCreated?: string
  valuable?: boolean
  proofLink?: string
}

export interface LogProductProgressInput {
  product?: string
  featureWorkedOn?: string
  stage?: string
  usersAffected?: number
  proofLink?: string
  proofType?: string
  blocker?: string
  nextAction?: string
}

export interface LogProofInput {
  entryId?: string
  type?: string
  label?: string
  url?: string
  text?: string
  fileName?: string
  mimeType?: string
  sizeBytes?: number
  metadata?: Record<string, unknown>
}

export interface CheckInInput {
  wakeUpTime?: string
  mood?: string
  energy?: number
  mainGoal?: string
  revenueTaskDone?: boolean
  productTaskDone?: boolean
  distributionTaskDone?: boolean
  deepWorkMinutes?: number
}

export interface EndDayInput {
  revenueTaskDone?: boolean
  productTaskDone?: boolean
  distributionTaskDone?: boolean
  deepWorkMinutes?: number
  biggestOutput?: string
  methodWorked?: string
  vanished?: string
  endOfDayReview?: string
}

export interface FounderBoxApiErrorBody {
  error: string
  code?: string
  details?: unknown
  resetAt?: string
}

export class FounderBoxApiError extends Error {
  status: number
  body: FounderBoxApiErrorBody

  constructor(status: number, body: FounderBoxApiErrorBody) {
    super(body.error || `FounderBox API error (${status})`)
    this.name = "FounderBoxApiError"
    this.status = status
    this.body = body
  }
}

export interface FounderBoxClientOptions {
  baseUrl: string
  getAccessToken?: () => string | null | undefined | Promise<string | null | undefined>
  fetcher?: typeof fetch
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  headers?: Record<string, string>
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "")
}

function makeIdempotencyKey() {
  const random = Math.random().toString(36).slice(2)
  return `fbop_${Date.now().toString(36)}_${random}`
}

export { makeIdempotencyKey }

export class FounderBoxClient {
  private baseUrl: string
  private getAccessToken?: FounderBoxClientOptions["getAccessToken"]
  private fetcher: typeof fetch

  constructor(options: FounderBoxClientOptions) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl)
    this.getAccessToken = options.getAccessToken
    this.fetcher = options.fetcher || fetch
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const token = await this.getAccessToken?.()
    const headers: Record<string, string> = {
      accept: "application/json",
      ...(options.body === undefined ? {} : { "content-type": "application/json" }),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }

    const response = await this.fetcher(`${this.baseUrl}${path}`, {
      method: options.method || (options.body === undefined ? "GET" : "POST"),
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null
    if (!response.ok) {
      throw new FounderBoxApiError(response.status, {
        error: typeof data?.error === "string" ? data.error : response.statusText,
        code: typeof data?.code === "string" ? data.code : undefined,
        details: data?.details,
        resetAt: typeof data?.resetAt === "string" ? data.resetAt : undefined,
      })
    }

    return data as T
  }

  requestOtp(email: string) {
    return this.request<RequestOtpResponse>("/api/mobile/auth/request-otp", { method: "POST", body: { email } })
  }

  verifyOtp(email: string, code: string) {
    return this.request<VerifyOtpResponse>("/api/mobile/auth/verify-otp", { method: "POST", body: { email, code } })
  }

  logout() {
    return this.request<{ ok: true }>("/api/mobile/auth/logout", { method: "POST", body: {} })
  }

  me() {
    return this.request<MobileMeResponse>("/api/mobile/me")
  }

  today() {
    return this.request<TodaySnapshot>("/api/accountability/today")
  }

  week() {
    return this.request<WeeklySnapshot>("/api/accountability/week")
  }

  checkIn(input: CheckInInput) {
    return this.request<{ review: Record<string, unknown> }>("/api/accountability/check-in", { method: "POST", body: input })
  }

  endDay(input: EndDayInput) {
    return this.request<{ review: Record<string, unknown> }>("/api/accountability/end-day", { method: "POST", body: input })
  }

  logOutreach(input: LogOutreachInput) {
    return this.request<EntryResponse>("/api/accountability/outreach", { method: "POST", body: input })
  }

  logWorkSession(input: LogWorkSessionInput) {
    return this.request<EntryResponse>("/api/accountability/work-session", { method: "POST", body: input })
  }

  logProductProgress(input: LogProductProgressInput) {
    return this.request<EntryResponse>("/api/accountability/product-progress", { method: "POST", body: input })
  }

  logProof(input: LogProofInput) {
    return this.request<ProofResponse>("/api/accountability/proof", { method: "POST", body: input })
  }

  flows() {
    return this.request<FlowsResponse>("/api/flows")
  }

  createFlow(input: { name?: string; description?: string; persona?: string; templateKey?: string }) {
    return this.request<{ flow: FlowSummary }>("/api/flows", { method: "POST", body: input })
  }

  updateAccountabilitySettings(input: { workspaceName?: string; persona?: string; dailyReminder?: boolean; weeklyReview?: boolean; reminderTime?: string; timezone?: string }) {
    return this.request<{ workspace: FounderBoxWorkspace; notifications: Record<string, unknown> }>("/api/accountability/settings", { method: "PATCH", body: input })
  }

  registerPushDevice(input: { expoPushToken: string; platform?: string; deviceName?: string; timezone?: string }) {
    return this.request<{ ok: true }>("/api/mobile/push/register", { method: "POST", body: input })
  }

  apiKeys() {
    return this.request<ApiKeysResponse>("/api/api-keys")
  }

  createApiKey(name: string) {
    return this.request<CreateApiKeyResponse>("/api/api-keys", { method: "POST", body: { name } })
  }

  sessions() {
    return this.request<SessionsResponse>("/api/account/sessions")
  }

  revokeOtherSessions() {
    return this.request<{ ok: true }>("/api/account/sessions", { method: "DELETE" })
  }

  checkout() {
    return this.request<CheckoutResponse>("/api/billing/checkout", { method: "POST", body: {} })
  }

  shareLinks() {
    return this.request<ShareLinksResponse>("/api/share-links")
  }

  createShareLink(input: { title?: string; redacted?: boolean; weekStart?: string; expiresAt?: string }) {
    return this.request<CreateShareLinkResponse>("/api/share-links", { method: "POST", body: input })
  }
}

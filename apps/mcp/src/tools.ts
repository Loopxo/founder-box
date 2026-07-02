import { randomUUID } from "node:crypto"
import { z } from "zod"
import { fromJsonSchema, type McpServer } from "@modelcontextprotocol/server"
import type { FounderBoxArtifact } from "@founderbox/core"
import {
  FOUNDERBOX_SKILLS,
  FOUNDERBOX_TOOLS,
  CONTRACT_TEMPLATES,
  RESUME_TEMPLATES,
  bulkGenerateProposals,
  calculateInvoiceTotals,
  calculateOutreachVolume,
  calculateSeoRoiProjection,
  createCompetitiveBrief,
  createInvoice,
  createLaunchpathWeeklyPlan,
  createSeoKeywordBrief,
  createStartupLensFramework,
  errorResult,
  estimateProposalPricing,
  generateColdEmail,
  generateColdEmailSequence,
  generateContract,
  generateProposal,
  generateResumeDraft,
  generateSalesPlan,
  generateSocialStrategy,
  generateStartupLensReport,
  generateSwot,
  getLaunchpathStageMap,
  getProposalTemplate,
  getStartupLensLayers,
  listProposalIndustries,
  okResult,
  optimizeResumeForJob,
  recommendLaunchpathStage,
  scoreLeads,
  scoreResumeAts,
} from "@founderbox/core"
import { getRequestContext } from "./context.js"
import { enforceRateLimit, getRateLimitStatus } from "./rate-limit.js"
import { prisma } from "./db.js"
import { artifactDownloadUrl, saveArtifact } from "./artifacts.js"
import { createSimplePdf } from "./pdf.js"
import {
  createAccountabilityEntryForUser,
  createShareReportForUser,
  ensureAccountabilityWorkspace,
  getTodayForUser,
  getWeeklyReportForUser,
  logProofForUser,
  upsertReviewForUser,
} from "./accountability.js"

type ToolEnvelope = ReturnType<typeof okResult<unknown>> | ReturnType<typeof errorResult>
type HandlerOutput = { data: unknown; __artifacts?: FounderBoxArtifact[] }

const MAX_TOOL_INPUT_BYTES = Number(process.env.FOUNDERBOX_MCP_MAX_INPUT_BYTES || 200_000)

function content(envelope: ToolEnvelope) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(envelope, null, 2) }],
    structuredContent: envelope as unknown as Record<string, unknown>,
  }
}

function errorCode(error: unknown) {
  return error instanceof Error && error.name ? error.name : "TOOL_ERROR"
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unexpected tool error."
}

function isHandlerOutput(value: unknown): value is HandlerOutput {
  return Boolean(value && typeof value === "object" && "data" in value)
}

function enforceInputSize(value: unknown) {
  const size = Buffer.byteLength(JSON.stringify(value ?? {}), "utf8")
  if (size <= MAX_TOOL_INPUT_BYTES) return
  const error = new Error(`Input is too large. Maximum MCP tool input is ${MAX_TOOL_INPUT_BYTES} bytes.`)
  error.name = "INPUT_TOO_LARGE"
  throw error
}

function requireContextUserId() {
  const context = getRequestContext()
  if (!context?.userId) throw new Error("FounderBox API key is required.")
  return context.userId
}

function registerTool<Input extends z.ZodTypeAny>(
  server: McpServer,
  name: string,
  description: string,
  inputSchema: Input,
  handler: (args: z.infer<Input>, runId: string) => Promise<unknown> | unknown,
) {
  server.registerTool(
    name,
    {
      title: name,
      description,
      inputSchema: fromJsonSchema(z.toJSONSchema(inputSchema) as never),
    },
    async (args: unknown) => {
      const runId = randomUUID()
      const context = getRequestContext()
      const startedAt = Date.now()
      let status = "ok"
      let code: string | undefined

      try {
        enforceInputSize(args)
        await enforceRateLimit(context, name)
        const output = await handler(args as z.infer<Input>, runId)
        const envelope = isHandlerOutput(output) ? okResult(name, runId, output.data, output.__artifacts) : okResult(name, runId, output)
        return content(envelope)
      } catch (error) {
        status = "error"
        code = errorCode(error)
        if (context?.userId && context.userId !== "dev-user" && code === "INPUT_TOO_LARGE") {
          await prisma.suspiciousUsageFlag.create({
            data: {
              type: "mcp_oversized_input",
              reason: `Oversized MCP input rejected for ${name}.`,
              severity: "medium",
              userId: context.userId,
              metadata: { toolName: name },
            },
          })
        }
        return content(errorResult(name, runId, code, errorMessage(error)))
      } finally {
        if (context?.userId && context.userId !== "dev-user") {
          await prisma.toolRun.create({
            data: {
              toolName: name,
              status,
              durationMs: Date.now() - startedAt,
              errorCode: code,
              userId: context.userId,
              apiKeyId: context.apiKeyId,
            },
          })
        }
      }
    },
  )
}

const ProfileSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  experience: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  projects: z.array(z.string()).optional(),
  education: z.array(z.string()).optional(),
})

const ResumeGenerateSchema = z.object({
  profile: ProfileSchema,
  desiredRole: z.string(),
  seniority: z.string().optional(),
  tone: z.enum(["concise", "executive", "technical", "founder"]).optional(),
})

const ProposalPackageSchema = z.object({
  name: z.string(),
  price: z.number(),
  features: z.array(z.string()),
  popular: z.boolean().optional(),
})

const ProposalGenerateSchema = z.object({
  clientName: z.string(),
  businessName: z.string(),
  industry: z.string(),
  services: z.array(z.string()).default([]),
  timeline: z.string(),
  agencyConfig: z
    .object({
      name: z.string().optional(),
      website: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  customPricing: z.array(ProposalPackageSchema).optional(),
  clientNotes: z.string().optional(),
})

const StartupLensSchema = z.object({
  companyName: z.string(),
  country: z.string().optional(),
  sector: z.string().optional(),
  stage: z.string().optional(),
  founderNotes: z.string().optional(),
  marketNotes: z.string().optional(),
  rawResearch: z.string().optional(),
})

const AccountabilityOutreachSchema = z.object({
  channel: z.string().optional(),
  clientName: z.string().optional(),
  messageUsed: z.string().optional(),
  methodUsed: z.string().optional(),
  personalizationLevel: z.string().optional(),
  offerSent: z.string().optional(),
  reply: z.boolean().optional(),
  outcome: z.string().optional(),
  followUpRequired: z.boolean().optional(),
})

const AccountabilityWorkSessionSchema = z.object({
  project: z.string().optional(),
  type: z.string().optional(),
  durationMinutes: z.number().optional(),
  outputCreated: z.string().optional(),
  proofLink: z.string().optional(),
  valuable: z.boolean().optional(),
})

const AccountabilityProductProgressSchema = z.object({
  product: z.string(),
  featureWorkedOn: z.string().optional(),
  stage: z.string().optional(),
  usersAffected: z.number().optional(),
  proofLink: z.string().optional(),
  blocker: z.string().optional(),
  nextAction: z.string().optional(),
})

async function savePdfArtifact(toolName: string, title: string, markdown: string) {
  const artifact = await saveArtifact({
    context: getRequestContext(),
    name: `${toolName}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`,
    type: "pdf",
    mimeType: "application/pdf",
    content: createSimplePdf(title, markdown),
  })
  return {
    data: { artifactId: artifact.id, name: artifact.name, url: artifact.url, expiresAt: artifact.expiresAt },
    __artifacts: [artifact],
  }
}

export function registerFounderBoxTools(server: McpServer) {
  registerTool(server, "founderbox_get_status", "Check FounderBox MCP health and limits.", z.object({}), async () => ({
    status: "healthy",
    account: getRequestContext()?.email || "unknown",
    plan: getRequestContext()?.plan || "unknown",
    rateLimits: await getRateLimitStatus(getRequestContext()),
    hostedLimits: { textCallsPerDay: 500, pdfRendersPerDay: 20, artifactTtlDays: 7 },
    mode: process.env.FOUNDERBOX_DISABLE_LIMITS === "true" ? "self-host" : "hosted",
  }))

  registerTool(server, "founderbox_list_tools", "List FounderBox MCP tools and skills.", z.object({ phase: z.enum(["v1", "v2", "all"]).optional() }), (args) => ({
    tools: FOUNDERBOX_TOOLS.filter((tool) => !args.phase || args.phase === "all" || tool.phase === args.phase),
    skills: FOUNDERBOX_SKILLS,
  }))

  registerTool(server, "accountability_get_today", "Get today's accountability snapshot.", z.object({}), async () => getTodayForUser(requireContextUserId()))
  registerTool(server, "accountability_start_day", "Create or update today's morning check-in.", z.object({ mainGoal: z.string().optional(), wakeUpTime: z.string().optional(), mood: z.string().optional(), energy: z.number().optional() }), async (args) => upsertReviewForUser(requireContextUserId(), args))
  registerTool(server, "accountability_log_outreach", "Log outreach, follow-up, reply, proposal, or close.", AccountabilityOutreachSchema, async (args) =>
    createAccountabilityEntryForUser(requireContextUserId(), {
      objectKey: "outreach_log",
      systemType: "outreach",
      title: args.clientName || args.channel || "Outreach",
      summary: args.messageUsed,
      values: {
        date: new Date().toISOString(),
        channel: args.channel,
        message_used: args.messageUsed,
        method_used: args.methodUsed,
        personalization_level: args.personalizationLevel,
        offer_sent: args.offerSent,
        reply: Boolean(args.reply),
        outcome: args.outcome || "Sent",
        follow_up_required: Boolean(args.followUpRequired),
      },
    }),
  )
  registerTool(server, "accountability_log_work_session", "Log a focused work session and output.", AccountabilityWorkSessionSchema, async (args) => {
    const entry = await createAccountabilityEntryForUser(requireContextUserId(), {
      objectKey: "work_sessions",
      systemType: "work_session",
      title: args.project || args.outputCreated || "Work session",
      summary: args.outputCreated,
      values: {
        date: new Date().toISOString(),
        project: args.project,
        type: args.type || "Product",
        duration_minutes: args.durationMinutes,
        output_created: args.outputCreated,
        valuable: args.valuable ?? true,
        proof_link: args.proofLink,
      },
    })
    if (args.proofLink) await logProofForUser(requireContextUserId(), { entryId: entry.id, type: "other", label: args.outputCreated || "Work proof", url: args.proofLink })
    return entry
  })
  registerTool(server, "accountability_log_product_progress", "Log product progress and proof.", AccountabilityProductProgressSchema, async (args) => {
    const entry = await createAccountabilityEntryForUser(requireContextUserId(), {
      objectKey: "product_progress",
      systemType: "product_progress",
      title: args.product,
      summary: args.featureWorkedOn,
      values: {
        product: args.product,
        feature_worked_on: args.featureWorkedOn,
        stage: args.stage || "Building",
        users_affected: args.usersAffected,
        proof_link: args.proofLink,
        blocker: args.blocker,
        next_action: args.nextAction,
      },
    })
    if (args.proofLink) await logProofForUser(requireContextUserId(), { entryId: entry.id, type: "deploy", label: args.featureWorkedOn || "Product proof", url: args.proofLink })
    return entry
  })
  registerTool(server, "accountability_log_proof", "Log URL or text proof.", z.object({ entryId: z.string().optional(), type: z.string().optional(), label: z.string().optional(), url: z.string().optional(), text: z.string().optional() }), async (args) => logProofForUser(requireContextUserId(), args))
  registerTool(server, "accountability_end_day_review", "Create the end-of-day review.", z.object({ biggestOutput: z.string().optional(), methodWorked: z.string().optional(), vanished: z.string().optional(), endOfDayReview: z.string().optional() }), async (args) => upsertReviewForUser(requireContextUserId(), args))
  registerTool(server, "accountability_get_weekly_report", "Generate the weekly proof report.", z.object({}), async () => getWeeklyReportForUser(requireContextUserId()))
  registerTool(server, "accountability_list_flows", "List installed accountability flows.", z.object({}), async () => {
    const workspace = await ensureAccountabilityWorkspace(requireContextUserId())
    return prisma.flow.findMany({ where: { workspaceId: workspace.id, archivedAt: null }, include: { objects: { include: { fields: true } } } })
  })
  registerTool(server, "accountability_create_entry", "Create an entry in a custom flow object.", z.object({ objectKey: z.string(), title: z.string().optional(), summary: z.string().optional(), values: z.record(z.string(), z.unknown()) }), async (args) =>
    createAccountabilityEntryForUser(requireContextUserId(), {
      objectKey: args.objectKey,
      systemType: args.objectKey,
      title: args.title,
      summary: args.summary,
      values: args.values as Record<string, unknown>,
    }),
  )
  registerTool(server, "accountability_query_metrics", "Query accountability metrics.", z.object({}), async () => (await getTodayForUser(requireContextUserId())).metrics)
  registerTool(server, "accountability_create_share_report", "Create a shareable weekly proof report.", z.object({}), async () => createShareReportForUser(requireContextUserId()))

  registerTool(server, "resume_list_templates", "List available Resume Forge templates.", z.object({}), () => RESUME_TEMPLATES)
  registerTool(server, "resume_generate", "Generate a role-focused resume draft.", ResumeGenerateSchema, (args) => generateResumeDraft(args))
  registerTool(server, "resume_optimize_for_job", "Tailor resume content to a job description.", ResumeGenerateSchema.extend({ jobDescription: z.string() }), (args) => optimizeResumeForJob(args))
  registerTool(server, "resume_score_ats", "Score resume text for ATS fit.", z.object({ resumeText: z.string(), jobDescription: z.string().optional() }), (args) => scoreResumeAts(args))
  registerTool(server, "resume_render_pdf", "Render a basic PDF resume artifact.", ResumeGenerateSchema.extend({ markdown: z.string().optional() }), async (args) => {
    const draft = args.markdown ? { headline: args.profile.name, markdown: args.markdown } : generateResumeDraft(args)
    return savePdfArtifact("resume", draft.headline, draft.markdown)
  })

  registerTool(server, "proposal_list_industries", "List supported proposal industries.", z.object({}), () => listProposalIndustries())
  registerTool(server, "proposal_get_template", "Get a proposal template for an industry.", z.object({ industry: z.string() }), (args) => getProposalTemplate(args.industry))
  registerTool(server, "proposal_generate", "Generate a complete client proposal.", ProposalGenerateSchema, (args) => generateProposal(args))
  registerTool(server, "proposal_estimate_pricing", "Estimate proposal pricing packages.", ProposalGenerateSchema.pick({ industry: true, services: true, timeline: true, customPricing: true }), (args) => estimateProposalPricing(args))
  registerTool(server, "proposal_bulk_generate", "Generate up to 10 proposals.", z.object({ proposals: z.array(ProposalGenerateSchema).max(10) }), (args) => bulkGenerateProposals(args.proposals))
  registerTool(server, "proposal_render_pdf", "Render a proposal PDF artifact.", ProposalGenerateSchema.extend({ markdown: z.string().optional() }), async (args) => {
    const draft = args.markdown ? { title: `${args.businessName} proposal`, markdown: args.markdown } : generateProposal(args)
    return savePdfArtifact("proposal", draft.title, draft.markdown)
  })

  registerTool(server, "startup_lens_get_layers", "Return Startup Lens framework layers.", z.object({}), () => getStartupLensLayers())
  registerTool(server, "startup_lens_create_framework", "Create a blank Startup Lens framework.", StartupLensSchema, (args) => createStartupLensFramework(args))
  registerTool(server, "startup_lens_analyze_notes", "Analyze notes against Startup Lens.", StartupLensSchema, (args) => generateStartupLensReport(args).framework)
  registerTool(server, "startup_lens_generate_report", "Generate a Startup Lens report.", StartupLensSchema, (args) => generateStartupLensReport(args))
  registerTool(server, "startup_lens_render_pdf", "Render a Startup Lens report PDF.", StartupLensSchema.extend({ markdown: z.string().optional() }), async (args) => {
    const report = args.markdown ? { markdown: args.markdown } : generateStartupLensReport(args)
    return savePdfArtifact("startup-lens", args.companyName, report.markdown)
  })

  registerTool(server, "launchpath_get_stage_map", "Return Launchpath Atlas stages.", z.object({}), () => getLaunchpathStageMap())
  registerTool(server, "launchpath_recommend_stage", "Recommend a founder stage.", z.object({ idea: z.string().optional(), currentProgress: z.string().optional(), customers: z.number().optional(), revenue: z.number().optional() }), (args) => recommendLaunchpathStage(args))
  registerTool(server, "launchpath_create_weekly_plan", "Create a weekly founder plan.", z.object({ stageName: z.string().optional(), goal: z.string().optional() }), (args) => createLaunchpathWeeklyPlan(args))
  registerTool(server, "launchpath_get_resources", "Return basic Launchpath resources.", z.object({}), () => ({ resources: ["Customer interviews", "Offer one-pager", "MVP checklist", "Launch checklist"] }))

  registerTool(server, "cold_email_list_industries", "List cold email industries.", z.object({}), () => ({ industries: ["saas", "agency", "local-business", "ecommerce", "consulting"] }))
  registerTool(server, "cold_email_generate", "Generate a cold email.", z.object({ recipientRole: z.string().optional(), industry: z.string().optional(), offer: z.string(), proof: z.string().optional(), tone: z.string().optional() }), (args) => generateColdEmail(args))
  registerTool(server, "cold_email_generate_sequence", "Generate a cold email sequence.", z.object({ offer: z.string(), industry: z.string().optional(), steps: z.number().optional() }), (args) => generateColdEmailSequence(args))
  registerTool(server, "cold_email_personalize", "Personalize a cold email.", z.object({ baseEmail: z.string(), personalization: z.string() }), (args) => ({ body: `${args.personalization}\n\n${args.baseEmail}` }))
  registerTool(server, "cold_email_calculate_outreach_volume", "Calculate outreach volume.", z.object({ targetReplies: z.number(), expectedReplyRatePercent: z.number() }), (args) => calculateOutreachVolume(args))

  registerTool(server, "competitive_create_brief", "Create a competitor brief.", z.object({ company: z.string(), competitors: z.array(z.string()), knownFacts: z.array(z.string()).optional() }), (args) => createCompetitiveBrief(args))
  registerTool(server, "competitive_compare_companies", "Compare companies on standard axes.", z.object({ company: z.string(), competitors: z.array(z.string()) }), (args) => createCompetitiveBrief(args))
  registerTool(server, "competitive_generate_swot", "Generate a SWOT analysis.", z.object({ company: z.string(), strengths: z.array(z.string()).optional(), weaknesses: z.array(z.string()).optional(), opportunities: z.array(z.string()).optional(), threats: z.array(z.string()).optional() }), (args) => generateSwot(args))
  registerTool(server, "competitive_generate_positioning_map", "Generate positioning map data.", z.object({ companies: z.array(z.string()) }), (args) => ({ axes: ["price", "specialization"], points: args.companies.map((company, index) => ({ company, x: index + 1, y: args.companies.length - index })) }))

  registerTool(server, "contract_list_templates", "List contract templates.", z.object({}), () => CONTRACT_TEMPLATES)
  registerTool(server, "contract_get_template_fields", "Get contract fields.", z.object({ templateId: z.string() }), (args) => CONTRACT_TEMPLATES.find((template) => template.id === args.templateId))
  registerTool(server, "contract_generate", "Generate a contract draft.", z.object({ templateId: z.string(), fields: z.record(z.string(), z.string()), clauses: z.array(z.string()).optional() }), (args) => generateContract(args))
  registerTool(server, "contract_add_clauses", "Add clauses to a contract draft.", z.object({ markdown: z.string(), clauses: z.array(z.string()) }), (args) => ({ markdown: `${args.markdown}\n\n## Additional Clauses\n${args.clauses.map((clause) => `- ${clause}`).join("\n")}` }))
  registerTool(server, "contract_render_pdf", "Render a contract PDF.", z.object({ title: z.string(), markdown: z.string() }), async (args) => savePdfArtifact("contract", args.title, args.markdown))

  registerTool(server, "invoice_calculate_totals", "Calculate invoice totals.", z.object({ items: z.array(z.object({ description: z.string(), quantity: z.number(), unitPrice: z.number() })), taxRatePercent: z.number().optional(), discount: z.number().optional() }), (args) => calculateInvoiceTotals(args))
  registerTool(server, "invoice_create", "Create an invoice.", z.object({ businessName: z.string(), clientName: z.string(), currency: z.string().optional(), items: z.array(z.object({ description: z.string(), quantity: z.number(), unitPrice: z.number() })), taxRatePercent: z.number().optional() }), (args) => createInvoice(args))
  registerTool(server, "invoice_apply_tax_region", "Apply tax region settings.", z.object({ region: z.string() }), (args) => ({ region: args.region, taxRatePercent: args.region.toLowerCase() === "india" ? 18 : 0 }))
  registerTool(server, "invoice_render_pdf", "Render an invoice PDF.", z.object({ title: z.string(), markdown: z.string() }), async (args) => savePdfArtifact("invoice", args.title, args.markdown))

  registerTool(server, "seo_create_keyword_brief", "Create an SEO keyword brief.", z.object({ keyword: z.string(), audience: z.string().optional(), product: z.string().optional() }), (args) => createSeoKeywordBrief(args))
  registerTool(server, "seo_generate_audit_plan", "Generate an SEO audit plan.", z.object({ website: z.string().optional(), business: z.string() }), (args) => ({ business: args.business, note: "No live crawling in v1.", checklist: ["Technical basics", "Keyword map", "Content gaps", "Conversion paths"] }))
  registerTool(server, "seo_generate_content_plan", "Generate SEO content plan.", z.object({ keywords: z.array(z.string()), audience: z.string().optional() }), (args) => ({ calendar: args.keywords.map((keyword, index) => ({ week: index + 1, keyword, format: "search-intent article" })) }))
  registerTool(server, "seo_calculate_roi_projection", "Calculate SEO ROI projection.", z.object({ monthlySearchVolume: z.number(), conversionRatePercent: z.number(), averageOrderValue: z.number(), expectedCtrPercent: z.number().optional() }), (args) => calculateSeoRoiProjection(args))

  registerTool(server, "sales_generate_sdr_plan", "Generate an SDR plan.", z.object({ product: z.string(), targetCustomer: z.string(), offer: z.string().optional() }), (args) => generateSalesPlan(args))
  registerTool(server, "sales_generate_script", "Generate a sales script.", z.object({ product: z.string(), targetCustomer: z.string(), offer: z.string().optional() }), (args) => ({ script: generateSalesPlan(args).scripts }))
  registerTool(server, "sales_score_leads", "Score leads.", z.object({ leads: z.array(z.object({ name: z.string(), budget: z.number().optional(), urgency: z.number().optional(), fit: z.number().optional() })) }), (args) => scoreLeads(args))
  registerTool(server, "sales_generate_followup_sequence", "Generate follow-up sequence.", z.object({ product: z.string(), targetCustomer: z.string(), offer: z.string().optional() }), (args) => ({ followups: generateSalesPlan(args).followups }))
  registerTool(server, "sales_pipeline_summary", "Summarize pipeline data.", z.object({ deals: z.array(z.object({ name: z.string(), value: z.number().optional(), stage: z.string().optional() })) }), (args) => ({ count: args.deals.length, value: args.deals.reduce((sum, deal) => sum + (deal.value || 0), 0), byStage: args.deals.map((deal) => deal.stage || "unknown") }))

  registerTool(server, "social_generate_strategy", "Generate social strategy.", z.object({ brand: z.string(), platform: z.string(), audience: z.string().optional(), goal: z.string().optional() }), (args) => generateSocialStrategy(args))
  registerTool(server, "social_generate_content_calendar", "Generate social calendar.", z.object({ brand: z.string(), platform: z.string(), audience: z.string().optional(), goal: z.string().optional() }), (args) => generateSocialStrategy(args).weeklySchedule)
  registerTool(server, "social_generate_post_ideas", "Generate post ideas.", z.object({ topic: z.string(), count: z.number().optional() }), (args) => Array.from({ length: Math.min(args.count || 5, 20) }, (_, index) => `${args.topic}: angle ${index + 1}`))
  registerTool(server, "social_generate_hashtags", "Generate hashtags.", z.object({ topic: z.string(), platform: z.string().optional() }), (args) => ({ hashtags: args.topic.split(/\s+/).slice(0, 5).map((word) => `#${word.replace(/[^a-z0-9]/gi, "")}`) }))
  registerTool(server, "social_generate_crisis_plan", "Generate crisis plan.", z.object({ scenario: z.string(), brand: z.string() }), (args) => ({ brand: args.brand, scenario: args.scenario, steps: ["Acknowledge quickly", "Pause scheduled posts", "State known facts", "Move support issues to owned channels", "Publish follow-up once resolved"] }))

  registerTool(server, "founderbox_list_available_skills", "List FounderBox skills.", z.object({}), () => ({ skills: FOUNDERBOX_SKILLS }))
  registerTool(server, "founderbox_get_account_usage", "Get current account usage.", z.object({}), async () => {
    const context = getRequestContext()
    if (!context?.userId || context.userId === "dev-user") return { plan: context?.plan || "dev", rateLimits: await getRateLimitStatus(context), usage: [] }
    const usage = await prisma.toolRun.groupBy({
      by: ["toolName"],
      where: { userId: context.userId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      _count: { _all: true },
    })
    return {
      plan: context.plan,
      email: context.email,
      rateLimits: await getRateLimitStatus(context),
      usage: usage.map((item) => ({ toolName: item.toolName, calls: item._count._all })),
    }
  })
  registerTool(server, "founderbox_list_artifacts", "List account artifacts.", z.object({}), async () => {
    const context = getRequestContext()
    if (!context?.userId || context.userId === "dev-user") return []
    const artifacts = await prisma.artifact.findMany({ where: { userId: context.userId, expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" }, take: 50 })
    return artifacts.map((artifact) => ({
      id: artifact.id,
      name: artifact.name,
      type: artifact.type,
      mimeType: artifact.mimeType,
      sizeBytes: artifact.sizeBytes,
      expiresAt: artifact.expiresAt,
      url: artifactDownloadUrl(artifact.id, artifact.expiresAt),
    }))
  })
  registerTool(server, "founderbox_get_artifact", "Get artifact metadata.", z.object({ id: z.string() }), async (args) => {
    const context = getRequestContext()
    if (!context?.userId || context.userId === "dev-user") return null
    const artifact = await prisma.artifact.findFirst({ where: { id: args.id, userId: context.userId, expiresAt: { gt: new Date() } } })
    return artifact
      ? {
          id: artifact.id,
          name: artifact.name,
          type: artifact.type,
          mimeType: artifact.mimeType,
          sizeBytes: artifact.sizeBytes,
          expiresAt: artifact.expiresAt,
          url: artifactDownloadUrl(artifact.id, artifact.expiresAt),
        }
      : null
  })
}

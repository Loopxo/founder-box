export function getLaunchpathStageMap() {
  return [
    { id: 1, name: "Think Like a Founder", output: "Founder mindset and constraints clarified." },
    { id: 2, name: "Find a Problem", output: "Pain, customer, and urgency validated." },
    { id: 3, name: "Design the Company", output: "Offer, model, and positioning selected." },
    { id: 4, name: "Build Version One", output: "Lean MVP shipped to real users." },
    { id: 5, name: "Launch", output: "Distribution loop and launch assets live." },
    { id: 6, name: "Scale", output: "Repeatable growth and operating cadence." },
  ]
}

export function recommendLaunchpathStage(input: { idea?: string; currentProgress?: string; customers?: number; revenue?: number }) {
  if ((input.revenue || 0) > 0) return getLaunchpathStageMap()[5]
  if ((input.customers || 0) > 0) return getLaunchpathStageMap()[4]
  if (input.currentProgress && /prototype|mvp|built|beta/i.test(input.currentProgress)) return getLaunchpathStageMap()[3]
  if (input.idea && /customer|problem|interview|pain/i.test(input.idea)) return getLaunchpathStageMap()[1]
  return getLaunchpathStageMap()[0]
}

export function createLaunchpathWeeklyPlan(input: { stageName?: string; goal?: string }) {
  const goal = input.goal || "move one stage closer to launch"
  return {
    goal,
    actions: ["Interview 5 target users.", "Write the riskiest assumption in one sentence.", "Create one testable offer.", "Ship or revise one public artifact."],
    expectedOutput: `A concrete artifact proving progress toward ${goal}.`,
    resources: ["FounderBox Launchpath Atlas", "Customer interview notes", "Offer one-pager"],
  }
}

export function generateColdEmail(input: { recipientRole?: string; industry?: string; offer: string; proof?: string; tone?: string }) {
  const role = input.recipientRole || "founder"
  return {
    subject: `${input.offer} for ${input.industry || "your team"}`,
    body: `Hi {{first_name}},\n\nNoticed ${role}s in ${input.industry || "your space"} often lose time on manual follow-up.\n\nWe help with ${input.offer}.${input.proof ? ` Recent proof: ${input.proof}.` : ""}\n\nWorth a quick conversation next week?\n\nBest,\n{{sender_name}}`,
    notes: ["Replace placeholders before sending.", "FounderBox v1 generates copy only and does not send outreach."],
  }
}

export function generateColdEmailSequence(input: { offer: string; industry?: string; steps?: number }) {
  const count = Math.min(Math.max(input.steps || 3, 1), 5)
  return Array.from({ length: count }, (_, index) => ({
    day: index === 0 ? 1 : index * 3 + 1,
    ...generateColdEmail({ offer: index === 0 ? input.offer : `${input.offer} follow-up ${index}`, industry: input.industry }),
  }))
}

export function calculateOutreachVolume(input: { targetReplies: number; expectedReplyRatePercent: number }) {
  const replyRate = Math.max(input.expectedReplyRatePercent, 1) / 100
  return {
    targetReplies: input.targetReplies,
    expectedReplyRatePercent: input.expectedReplyRatePercent,
    requiredProspects: Math.ceil(input.targetReplies / replyRate),
  }
}

export function createCompetitiveBrief(input: { company: string; competitors: string[]; knownFacts?: string[] }) {
  return {
    company: input.company,
    competitors: input.competitors,
    knownFacts: input.knownFacts || [],
    assumptions: ["Positioning, pricing, and growth channels must be verified with current public sources before final decisions."],
    comparisonAxes: ["target customer", "price", "primary channel", "proof", "switching cost"],
  }
}

export function generateSwot(input: { company: string; strengths?: string[]; weaknesses?: string[]; opportunities?: string[]; threats?: string[] }) {
  return {
    company: input.company,
    strengths: input.strengths || ["Clear founder-led focus"],
    weaknesses: input.weaknesses || ["Evidence needs validation"],
    opportunities: input.opportunities || ["Narrower niche positioning"],
    threats: input.threats || ["Fast-copying competitors"],
  }
}

export const CONTRACT_TEMPLATES = [
  { id: "service-agreement", name: "Service Agreement", fields: ["clientName", "providerName", "scope", "fee", "timeline"] },
  { id: "nda", name: "Mutual NDA", fields: ["partyA", "partyB", "purpose", "term"] },
  { id: "contractor", name: "Independent Contractor Agreement", fields: ["clientName", "contractorName", "scope", "rate", "term"] },
]

export function generateContract(input: { templateId: string; fields: Record<string, string>; clauses?: string[] }) {
  const template = CONTRACT_TEMPLATES.find((item) => item.id === input.templateId) || CONTRACT_TEMPLATES[0]
  const missingFields = template.fields.filter((field) => !input.fields[field])
  const body = template.fields.map((field) => `${field}: ${input.fields[field] || "[missing]"}`).join("\n")
  return {
    template,
    missingFields,
    disclaimer: "This draft is for informational purposes only and is not legal advice. Review with qualified counsel before signing.",
    markdown: `# ${template.name}\n\n${body}\n\n## Clauses\n${(input.clauses || ["Confidentiality", "Payment terms", "Termination"]).map((clause) => `- ${clause}`).join("\n")}\n\n**Disclaimer:** This draft is not legal advice.`,
  }
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export function calculateInvoiceTotals(input: { items: InvoiceItem[]; taxRatePercent?: number; discount?: number }) {
  const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const discount = input.discount || 0
  const taxable = Math.max(0, subtotal - discount)
  const tax = Math.round(taxable * ((input.taxRatePercent || 0) / 100) * 100) / 100
  const total = Math.round((taxable + tax) * 100) / 100
  return { subtotal, discount, tax, total }
}

export function createInvoice(input: { businessName: string; clientName: string; currency?: string; items: InvoiceItem[]; taxRatePercent?: number }) {
  const totals = calculateInvoiceTotals(input)
  return {
    invoiceNumber: `FB-${Date.now().toString().slice(-8)}`,
    businessName: input.businessName,
    clientName: input.clientName,
    currency: input.currency || "USD",
    items: input.items,
    totals,
  }
}

export function createSeoKeywordBrief(input: { keyword: string; audience?: string; product?: string }) {
  return {
    keyword: input.keyword,
    searchIntent: "Use user-provided SERP research to confirm; default assumption is commercial investigation.",
    audience: input.audience || "target buyers",
    outline: ["Problem framing", "Evaluation criteria", "Options and tradeoffs", "FounderBox-style action checklist"],
    warning: "This tool does not crawl live websites in v1.",
  }
}

export function calculateSeoRoiProjection(input: { monthlySearchVolume: number; conversionRatePercent: number; averageOrderValue: number; expectedCtrPercent?: number }) {
  const visitors = input.monthlySearchVolume * ((input.expectedCtrPercent || 3) / 100)
  const conversions = visitors * (input.conversionRatePercent / 100)
  return {
    estimatedMonthlyVisitors: Math.round(visitors),
    estimatedMonthlyConversions: Math.round(conversions * 100) / 100,
    estimatedMonthlyRevenue: Math.round(conversions * input.averageOrderValue),
  }
}

export function generateSalesPlan(input: { product: string; targetCustomer: string; offer?: string }) {
  return {
    positioning: `${input.product} for ${input.targetCustomer}`,
    offer: input.offer || "book a discovery call",
    scripts: ["Open with the customer pain.", "Qualify urgency and owner.", "Show relevant proof.", "Ask for the next concrete step."],
    followups: ["Recap the problem.", "Send proof asset.", "Ask for decision criteria."],
  }
}

export function scoreLeads(input: { leads: Array<{ name: string; budget?: number; urgency?: number; fit?: number }> }) {
  return input.leads.map((lead) => ({
    ...lead,
    score: Math.min(100, (lead.budget || 0) / 100 + (lead.urgency || 0) * 20 + (lead.fit || 0) * 20),
  }))
}

export function generateSocialStrategy(input: { brand: string; platform: string; audience?: string; goal?: string }) {
  const pillars = ["Founder POV", "Customer pain", "Proof and outcomes", "Behind the build"]
  return {
    brand: input.brand,
    platform: input.platform,
    audience: input.audience || "target buyers",
    goal: input.goal || "increase qualified attention",
    pillars,
    weeklySchedule: pillars.map((pillar, index) => ({ day: ["Mon", "Tue", "Wed", "Thu"][index], pillar, format: index % 2 ? "short post" : "case study" })),
  }
}

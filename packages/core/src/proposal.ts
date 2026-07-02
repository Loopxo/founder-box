export interface ProposalPricingPackage {
  name: string
  price: number
  features: string[]
  popular?: boolean
}

export interface ProposalTemplate {
  industry: string
  problemStatements: string[]
  solutionBlocks: string[]
  basePackages: ProposalPricingPackage[]
}

export interface ProposalGenerateInput {
  clientName: string
  businessName: string
  industry: string
  services: string[]
  timeline: string
  agencyConfig?: {
    name?: string
    website?: string
    email?: string
  }
  customPricing?: ProposalPricingPackage[]
  clientNotes?: string
}

export interface ProposalDraft {
  title: string
  executiveSummary: string
  problems: string[]
  solution: string[]
  pricing: ProposalPricingPackage[]
  timeline: string
  nextSteps: string[]
  markdown: string
}

const GENERIC_TEMPLATE: ProposalTemplate = {
  industry: "general",
  problemStatements: [
    "The business needs a clearer digital presence that turns interest into qualified inquiries.",
    "Manual workflows are slowing sales, onboarding, and customer communication.",
    "The current offer needs stronger positioning, proof, and conversion flow.",
  ],
  solutionBlocks: [
    "Clarify the offer and customer journey before building assets.",
    "Create a conversion-focused web or workflow system around the highest-value action.",
    "Add measurement, follow-up, and handoff systems so the business can improve after launch.",
  ],
  basePackages: [
    { name: "Starter", price: 1800, features: ["Strategy session", "Core deliverables", "Launch checklist"] },
    { name: "Growth", price: 3500, popular: true, features: ["Everything in Starter", "Automation setup", "Conversion copy", "30 days support"] },
    { name: "Scale", price: 6500, features: ["Everything in Growth", "Advanced integrations", "Analytics dashboard", "90 days support"] },
  ],
}

const TEMPLATES: ProposalTemplate[] = [
  {
    industry: "saas",
    problemStatements: [
      "Trial users need faster activation and clearer product value.",
      "Growth depends on better onboarding, lifecycle messaging, and conversion tracking.",
      "Sales teams need proof assets that reduce hesitation in demo follow-up.",
    ],
    solutionBlocks: [
      "Map the activation path and remove friction from signup to first value.",
      "Build lifecycle messaging and product-led conversion assets.",
      "Create sales collateral that makes the buying decision easier for each stakeholder.",
    ],
    basePackages: [
      { name: "Activation Sprint", price: 2500, features: ["Activation audit", "Onboarding copy", "Analytics plan"] },
      { name: "Growth System", price: 5200, popular: true, features: ["Lifecycle emails", "Landing page", "Experiment backlog", "30 days support"] },
      { name: "Revenue Engine", price: 9800, features: ["Sales assets", "Automations", "Dashboard", "Quarterly growth roadmap"] },
    ],
  },
  {
    industry: "agency",
    problemStatements: [
      "Leads do not immediately understand the agency's specialization and proof.",
      "Proposal quality varies across opportunities, causing slower closes.",
      "Founder-led sales needs a repeatable handoff from discovery to contract.",
    ],
    solutionBlocks: [
      "Sharpen positioning around a narrow buyer, pain, and result.",
      "Create reusable proposal, case study, and follow-up systems.",
      "Turn discovery notes into consistent scopes, pricing, and next steps.",
    ],
    basePackages: [
      { name: "Positioning Kit", price: 1500, features: ["Offer audit", "Landing copy", "Proposal template"] },
      { name: "Sales Kit", price: 3200, popular: true, features: ["Case study system", "Follow-up sequence", "Pricing page", "CRM handoff"] },
      { name: "Agency OS", price: 7200, features: ["Full sales workflow", "Automation", "Reporting", "Team training"] },
    ],
  },
  {
    industry: "local-business",
    problemStatements: [
      "Customers expect mobile-first discovery, booking, and clear pricing.",
      "Missed calls and manual follow-up create lost revenue.",
      "Local competitors with stronger online trust win high-intent buyers.",
    ],
    solutionBlocks: [
      "Build a mobile-first website focused on calls, bookings, and trust signals.",
      "Add direct inquiry, booking, and reminder workflows.",
      "Improve local search visibility and review-driven conversion.",
    ],
    basePackages: [
      { name: "Local Starter", price: 1200, features: ["5-page website", "Contact flow", "Local SEO basics"] },
      { name: "Booking Pro", price: 2800, popular: true, features: ["Online booking", "Review prompts", "SMS/email reminders", "Analytics"] },
      { name: "Local Growth", price: 5600, features: ["Ads setup", "CRM", "Retention emails", "90 days optimization"] },
    ],
  },
]

export function listProposalIndustries() {
  return TEMPLATES.map((template) => template.industry)
}

export function getProposalTemplate(industry: string): ProposalTemplate {
  return TEMPLATES.find((template) => template.industry === industry.toLowerCase()) || GENERIC_TEMPLATE
}

export function estimateProposalPricing(input: Pick<ProposalGenerateInput, "industry" | "services" | "timeline" | "customPricing">) {
  if (input.customPricing?.length) {
    return input.customPricing
  }

  const template = getProposalTemplate(input.industry)
  const serviceMultiplier = Math.max(1, Math.min(2, input.services.length / 3))
  const rushMultiplier = /rush|urgent|asap|1 week|one week/i.test(input.timeline) ? 1.25 : 1

  return template.basePackages.map((pkg) => ({
    ...pkg,
    price: Math.round(pkg.price * serviceMultiplier * rushMultiplier),
  }))
}

export function generateProposal(input: ProposalGenerateInput): ProposalDraft {
  const template = getProposalTemplate(input.industry)
  const pricing = estimateProposalPricing(input)
  const agencyName = input.agencyConfig?.name || "FounderBox Partner"
  const title = `${input.businessName} proposal for ${input.clientName}`
  const services = input.services.length ? input.services : ["strategy", "implementation", "launch support"]
  const executiveSummary = `${agencyName} will help ${input.businessName} improve ${services.join(", ")} with a focused ${input.timeline} engagement. The proposal prioritizes measurable business outcomes, clear delivery checkpoints, and practical next steps.`
  const solution = [
    ...template.solutionBlocks,
    `Primary deliverables: ${services.join(", ")}.`,
    input.clientNotes ? `Client context to preserve: ${input.clientNotes}` : "Client context to preserve: confirm specific goals during kickoff.",
  ]
  const nextSteps = ["Confirm scope and preferred package.", "Schedule kickoff and collect required assets.", "Approve timeline, invoice, and working agreement."]
  const markdown = [
    `# ${title}`,
    "",
    "## Executive Summary",
    executiveSummary,
    "",
    "## Problems",
    template.problemStatements.map((problem) => `- ${problem}`).join("\n"),
    "",
    "## Recommended Solution",
    solution.map((item) => `- ${item}`).join("\n"),
    "",
    "## Pricing",
    pricing.map((pkg) => `- ${pkg.name}: $${pkg.price.toLocaleString()} - ${pkg.features.join(", ")}`).join("\n"),
    "",
    "## Timeline",
    input.timeline,
    "",
    "## Next Steps",
    nextSteps.map((step) => `- ${step}`).join("\n"),
  ].join("\n")

  return {
    title,
    executiveSummary,
    problems: template.problemStatements,
    solution,
    pricing,
    timeline: input.timeline,
    nextSteps,
    markdown,
  }
}

export function bulkGenerateProposals(inputs: ProposalGenerateInput[]) {
  if (inputs.length > 10) {
    throw new Error("Bulk proposal generation supports up to 10 clients in v1.")
  }

  return inputs.map((input) => generateProposal(input))
}

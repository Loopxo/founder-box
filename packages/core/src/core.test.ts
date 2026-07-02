import { describe, expect, it } from "vitest"
import { bulkGenerateProposals, calculateInvoiceTotals, generateProposal, generateResumeDraft, generateStartupLensReport, scoreResumeAts } from "./index.js"

describe("FounderBox core", () => {
  it("generates and scores a resume draft", () => {
    const draft = generateResumeDraft({
      profile: {
        name: "Alex Founder",
        email: "alex@example.com",
        skills: ["React", "Product strategy"],
        experience: ["Launched a SaaS onboarding flow"],
      },
      desiredRole: "Product Manager",
    })

    const score = scoreResumeAts({
      resumeText: draft.markdown,
      jobDescription: "Product manager with React, onboarding, and product strategy experience.",
    })

    expect(draft.markdown).toContain("Product Manager")
    expect(score.score).toBeGreaterThan(50)
  })

  it("generates proposals and enforces bulk limit", () => {
    const proposal = generateProposal({
      clientName: "Client",
      businessName: "ClientCo",
      industry: "saas",
      services: ["landing page", "lifecycle emails"],
      timeline: "4 weeks",
    })

    expect(proposal.pricing.length).toBeGreaterThan(0)
    expect(() =>
      bulkGenerateProposals(
        Array.from({ length: 11 }, (_, index) => ({
          clientName: `Client ${index}`,
          businessName: `Business ${index}`,
          industry: "agency",
          services: ["proposal system"],
          timeline: "2 weeks",
        })),
      ),
    ).toThrow(/up to 10/)
  })

  it("calculates invoice totals deterministically", () => {
    const totals = calculateInvoiceTotals({
      items: [
        { description: "Build", quantity: 2, unitPrice: 500 },
        { description: "Support", quantity: 1, unitPrice: 200 },
      ],
      discount: 100,
      taxRatePercent: 10,
    })

    expect(totals).toEqual({ subtotal: 1200, discount: 100, tax: 110, total: 1210 })
  })

  it("marks missing Startup Lens data instead of filling gaps", () => {
    const report = generateStartupLensReport({
      companyName: "SparseCo",
      country: "US",
      sector: "AI tools",
      stage: "idea",
      founderNotes: "The founder saw a painful manual workflow.",
    })

    expect(report.framework.researchGaps.length).toBeGreaterThan(0)
    expect(report.markdown).toContain("Research Gaps")
  })
})

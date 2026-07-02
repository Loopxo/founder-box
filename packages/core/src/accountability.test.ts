import { describe, expect, it } from "vitest"
import {
  ACCOUNTABILITY_FLOW_TEMPLATES,
  buildWeeklyReportMarkdown,
  calculateMethodStats,
  calculateRevenueAttempts,
  calculateShippedOutputs,
  getPlanLimits,
  hasProAccess,
  validateFieldValue,
} from "./index.js"

describe("FounderBox accountability core", () => {
  const entries = [
    { systemType: "outreach", data: { outcome: "Sent", methodUsed: "Loom audit" } },
    { systemType: "outreach", data: { outcome: "Replied", reply: true, methodUsed: "Loom audit" } },
    { systemType: "outreach", data: { outcome: "Closed", reply: true, methodUsed: "Homepage preview" } },
    { systemType: "work_session", data: { durationMinutes: 90, outputCreated: "Deployed billing page", outputType: "deploy" }, proofAssets: [{ type: "deploy" }] },
    { systemType: "product_progress", data: { stage: "Deployed", product: "FounderBox", outputType: "feature" } },
  ]

  it("ships the required starter flow templates", () => {
    expect(ACCOUNTABILITY_FLOW_TEMPLATES.map((template) => template.key)).toEqual([
      "solo-dev",
      "indie-hacker",
      "agency-owner",
      "freelancer",
      "client-outreach-sprint",
      "product-shipping-sprint",
      "personal-discipline-reset",
    ])
    expect(ACCOUNTABILITY_FLOW_TEMPLATES[0].objects.map((object) => object.key)).toContain("outreach_log")
  })

  it("calculates revenue attempts and shipped outputs", () => {
    expect(calculateRevenueAttempts(entries).total).toBe(6)
    expect(calculateShippedOutputs(entries).total).toBe(2)
  })

  it("calculates method stats by replies and closes", () => {
    const stats = calculateMethodStats(entries)
    expect(stats[0]).toMatchObject({ method: "Homepage preview", closeCount: 1 })
    expect(stats.find((method) => method.method === "Loom audit")?.replyCount).toBe(1)
  })

  it("validates controlled field values", () => {
    expect(validateFieldValue("url", "https://loopxo.com").valid).toBe(true)
    expect(validateFieldValue("url", "not-url").valid).toBe(false)
    expect(validateFieldValue("duration", "45").valid).toBe(true)
  })

  it("keeps free and founding pro entitlements distinct", () => {
    expect(getPlanLimits("free").activeFlows).toBe(1)
    expect(getPlanLimits("founding-pro").customDashboards).toBe(true)
    expect(hasProAccess({ status: "active", lemonVariantId: "123", plan: { slug: "founding-pro" } })).toBe(true)
    expect(hasProAccess({ status: "cancelled", lemonVariantId: "123" })).toBe(false)
  })

  it("builds a weekly proof report", () => {
    const markdown = buildWeeklyReportMarkdown({
      weekStart: "2026-05-11",
      entries,
      dailyReviews: [{ date: "2026-05-11", biggestOutput: "Billing page shipped", methodWorked: "Homepage preview" }],
    })

    expect(markdown).toContain("Revenue attempts: 6")
    expect(markdown).toContain("Shipped outputs: 2")
    expect(markdown).toContain("Billing page shipped")
  })
})

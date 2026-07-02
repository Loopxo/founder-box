import { NextRequest, NextResponse } from "next/server"
import { flagSuspiciousUsage } from "@/lib/audit"
import { processLemonSqueezyWebhook, verifyLemonSqueezySignature } from "@/lib/billing"
import { logServerEvent } from "@/lib/logger"

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get("X-Signature")

  if (!rawBody || !verifyLemonSqueezySignature(rawBody, signature)) {
    await flagSuspiciousUsage({
      type: "webhook_invalid_signature",
      reason: "Lemon Squeezy webhook was rejected because the signature did not match.",
      severity: "high",
      metadata: { hasBody: Boolean(rawBody), hasSignature: Boolean(signature), userAgent: request.headers.get("user-agent") },
    })
    await logServerEvent("warn", "Invalid Lemon Squeezy webhook signature", { source: "lemonsqueezy" })
    return NextResponse.json({ error: "Invalid Lemon Squeezy signature." }, { status: 400 })
  }

  try {
    const result = await processLemonSqueezyWebhook(rawBody)
    return NextResponse.json({ ok: true, processed: result.processed })
  } catch (error) {
    await flagSuspiciousUsage({
      type: "webhook_processing_failure",
      reason: error instanceof Error ? error.message : "Lemon Squeezy webhook processing failed.",
      severity: "medium",
    })
    await logServerEvent("error", "Lemon Squeezy webhook processing failed", { source: "lemonsqueezy", error: error instanceof Error ? error.message : "unknown" })
    throw error
  }
}

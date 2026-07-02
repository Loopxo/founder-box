import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createOtpCode, hashSecret } from "@founderbox/core"
import { prisma } from "@/lib/prisma"
import { flagSuspiciousUsage, requestMeta, writeAuditEvent } from "@/lib/audit"
import { assertSameOrigin, enforceApiRateLimit, payloadTooLargeResponse, readJsonBody } from "@/lib/security"

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : ""
}

export async function POST(request: NextRequest) {
  const csrfResponse = assertSameOrigin(request)
  if (csrfResponse) return csrfResponse

  const meta = requestMeta(request)
  const rateLimitResponse = await enforceApiRateLimit({ ip: meta.ipAddress, scope: "auth:request-otp", limit: 10 })
  if (rateLimitResponse) return rateLimitResponse

  let body: Record<string, unknown>
  try {
    body = await readJsonBody(request)
  } catch (error) {
    return payloadTooLargeResponse(error) || NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  const email = normalizeEmail(body.email)
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 })
  }

  const recentWindow = new Date(Date.now() - 60 * 1000)
  const dayWindow = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const [recentCount, dayCount] = await Promise.all([
    prisma.otpChallenge.count({ where: { email, createdAt: { gte: recentWindow } } }),
    prisma.otpChallenge.count({ where: { email, createdAt: { gte: dayWindow } } }),
  ])
  if (recentCount >= 1) return NextResponse.json({ error: "Wait a minute before requesting another code." }, { status: 429 })
  if (dayCount >= 10) {
    await flagSuspiciousUsage({ type: "otp_request_burst", reason: "Too many OTP requests in 24 hours.", severity: "medium", metadata: { email } })
    return NextResponse.json({ error: "Too many OTP requests today. Try again later." }, { status: 429 })
  }

  const code = createOtpCode()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  })

  await prisma.otpChallenge.create({
    data: {
      email,
      userId: user.id,
      codeHash: hashSecret(code, process.env.SESSION_SECRET || "founderbox-dev-session-secret"),
      expiresAt,
      maxAttempts: 5,
    },
  })

  const resendKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL

  if (resendKey && from) {
    const resend = new Resend(resendKey)
    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: "Your FounderBox login code",
      text: `Your FounderBox login code is ${code}. It expires in 10 minutes.`,
    })

    if (error) {
      await writeAuditEvent({ action: "auth.otp.request_failed", userId: user.id, metadata: { email, provider: "resend" }, request })
      return NextResponse.json({ error: "Could not send OTP email. Check Resend configuration and try again." }, { status: 502 })
    }
  }

  await writeAuditEvent({ action: "auth.otp.requested", userId: user.id, metadata: { email }, request })

  return NextResponse.json({
    ok: true,
    expiresAt,
    devCode: !resendKey && process.env.NODE_ENV !== "production" ? code : undefined,
  })
}

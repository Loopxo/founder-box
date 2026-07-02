import { NextRequest, NextResponse } from "next/server"
import { hashSecret, safeCompareHash } from "@founderbox/core"
import { prisma } from "@/lib/prisma"
import { SESSION_COOKIE, createSession, sessionCookieOptions } from "@/lib/auth"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { trackServerEvent } from "@/lib/analytics"
import { flagSuspiciousUsage, requestMeta, writeAuditEvent } from "@/lib/audit"
import { assertSameOrigin, enforceApiRateLimit, payloadTooLargeResponse, readJsonBody } from "@/lib/security"

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : ""
}

export async function POST(request: NextRequest) {
  const csrfResponse = assertSameOrigin(request)
  if (csrfResponse) return csrfResponse

  const meta = requestMeta(request)
  const rateLimitResponse = await enforceApiRateLimit({ ip: meta.ipAddress, scope: "auth:verify-otp", limit: 30 })
  if (rateLimitResponse) return rateLimitResponse

  let body: Record<string, unknown>
  try {
    body = await readJsonBody(request)
  } catch (error) {
    return payloadTooLargeResponse(error) || NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }
  const email = normalizeEmail(body.email)
  const code = typeof body.code === "string" ? body.code.trim() : ""

  if (!email || !code) {
    return NextResponse.json({ error: "Email and OTP code are required." }, { status: 400 })
  }

  const challenge = await prisma.otpChallenge.findFirst({
    where: {
      email,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  })

  if (!challenge) {
    return NextResponse.json({ error: "OTP expired or not found. Request a new code." }, { status: 400 })
  }

  if (challenge.attempts >= challenge.maxAttempts) {
    await flagSuspiciousUsage({ type: "otp_max_attempts", reason: "OTP challenge exceeded max attempts.", severity: "medium", userId: challenge.userId, metadata: { email } })
    return NextResponse.json({ error: "Too many OTP attempts. Request a new code." }, { status: 429 })
  }

  const matches = safeCompareHash(code, challenge.codeHash, process.env.SESSION_SECRET || "founderbox-dev-session-secret")
  if (!matches) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    })
    await writeAuditEvent({ action: "auth.otp.verify_failed", userId: challenge.userId, metadata: { email }, request })
    return NextResponse.json({ error: "Incorrect OTP code." }, { status: 400 })
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  })
  const workspace = await ensureWorkspaceForUser(user)

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: {
      consumedAt: new Date(),
      codeHash: hashSecret(`consumed:${challenge.id}`, process.env.SESSION_SECRET || "founderbox-dev-session-secret"),
    },
  })

  const session = await createSession(user.id, request)
  await writeAuditEvent({ action: "auth.otp.verified", userId: user.id, request })
  await trackServerEvent({ event: "otp_login_verified", userId: user.id, workspaceId: workspace.id })
  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
  response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions())
  return response
}

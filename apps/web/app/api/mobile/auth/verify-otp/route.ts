import { NextRequest, NextResponse } from "next/server"
import { hashSecret, safeCompareHash } from "@founderbox/core"
import { ensureWorkspaceForUser, getUserPlan } from "@/lib/accountability"
import { trackServerEvent } from "@/lib/analytics"
import { flagSuspiciousUsage, requestMeta, writeAuditEvent } from "@/lib/audit"
import { createSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { enforceApiRateLimit, payloadTooLargeResponse, readJsonBody } from "@/lib/security"

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : ""
}

function planStatus(plan: string) {
  return { plan, label: plan === "founding-pro" ? "Founding Pro" : "Free", isPro: plan === "founding-pro" }
}

export async function POST(request: NextRequest) {
  const meta = requestMeta(request)
  const rateLimitResponse = await enforceApiRateLimit({ ip: meta.ipAddress, scope: "mobile:auth:verify-otp", limit: 30 })
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
    where: { email, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  })

  if (!challenge) return NextResponse.json({ error: "OTP expired or not found. Request a new code." }, { status: 400 })
  if (challenge.attempts >= challenge.maxAttempts) {
    await flagSuspiciousUsage({ type: "mobile_otp_max_attempts", reason: "Mobile OTP challenge exceeded max attempts.", severity: "medium", userId: challenge.userId, metadata: { email } })
    return NextResponse.json({ error: "Too many OTP attempts. Request a new code." }, { status: 429 })
  }

  const matches = safeCompareHash(code, challenge.codeHash, process.env.SESSION_SECRET || "founderbox-dev-session-secret")
  if (!matches) {
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } })
    await writeAuditEvent({ action: "mobile.auth.otp.verify_failed", userId: challenge.userId, metadata: { email }, request })
    return NextResponse.json({ error: "Incorrect OTP code." }, { status: 400 })
  }

  const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email } })
  const workspace = await ensureWorkspaceForUser(user)
  const plan = await getUserPlan(user.id)

  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: {
      consumedAt: new Date(),
      codeHash: hashSecret(`consumed:${challenge.id}`, process.env.SESSION_SECRET || "founderbox-dev-session-secret"),
    },
  })

  const session = await createSession(user.id, request)
  await writeAuditEvent({ action: "mobile.auth.otp.verified", userId: user.id, workspaceId: workspace.id, request })
  await trackServerEvent({ event: "mobile_otp_login_verified", userId: user.id, workspaceId: workspace.id })

  return NextResponse.json({
    ok: true,
    accessToken: session.token,
    expiresAt: session.expiresAt,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug, persona: workspace.persona },
    plan: planStatus(plan),
  })
}

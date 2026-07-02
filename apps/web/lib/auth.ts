import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createSessionToken, hashSecret } from "@founderbox/core"
import { prisma } from "./prisma"
import { assertSameOrigin, enforceApiRateLimit, isSafeMethod } from "./security"

export const SESSION_COOKIE = "fb_session"

const SESSION_DAYS = 30

function sessionSecret() {
  return process.env.SESSION_SECRET || "founderbox-dev-session-secret"
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  }
}

export function bearerTokenFromRequest(request: NextRequest) {
  const header = request.headers.get("authorization")
  if (!header?.toLowerCase().startsWith("bearer ")) return null
  const token = header.slice("bearer ".length).trim()
  return token || null
}

async function findSessionByToken(token: string) {
  const session = await prisma.session.findFirst({
    where: {
      tokenHash: hashSecret(token, sessionSecret()),
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  })

  if (!session) return null

  await prisma.session.update({
    where: { id: session.id },
    data: { lastSeenAt: new Date() },
  })

  return session
}

export async function createSession(userId: string, request?: NextRequest) {
  const token = createSessionToken()
  const tokenHash = hashSecret(token, sessionSecret())
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
      userAgent: request?.headers.get("user-agent") || undefined,
      ipAddress: request?.headers.get("x-forwarded-for") || undefined,
    },
  })

  return { token, expiresAt }
}

export async function getCurrentUser() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await findSessionByToken(token)
  return session?.user || null
}

export async function getCurrentUserFromRequest(request: NextRequest) {
  const token = bearerTokenFromRequest(request)
  if (!token) return getCurrentUser()

  const session = await findSessionByToken(token)
  return session?.user || null
}

export async function getCurrentSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null

  return findSessionByToken(token)
}

export async function getCurrentSessionFromRequest(request: NextRequest) {
  const token = bearerTokenFromRequest(request)
  if (!token) return getCurrentSession()

  return findSessionByToken(token)
}

export function isAdmin(user: { role?: string | null } | null | undefined) {
  return user?.role === "admin"
}

export async function requireCurrentUser(request?: NextRequest) {
  const bearerToken = request ? bearerTokenFromRequest(request) : null
  if (request && !bearerToken) {
    const csrfResponse = assertSameOrigin(request)
    if (csrfResponse) return { user: null, response: csrfResponse }
  }

  const user = request ? await getCurrentUserFromRequest(request) : await getCurrentUser()
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  if (request && !isSafeMethod(request.method)) {
    const rateLimitResponse = await enforceApiRateLimit({ userId: user.id, scope: request.nextUrl.pathname })
    if (rateLimitResponse) return { user: null, response: rateLimitResponse }
  }

  return { user, response: null }
}

export async function requireAdminUser(request?: NextRequest) {
  const bearerToken = request ? bearerTokenFromRequest(request) : null
  if (request && !bearerToken) {
    const csrfResponse = assertSameOrigin(request)
    if (csrfResponse) return { user: null, response: csrfResponse }
  }

  const user = request ? await getCurrentUserFromRequest(request) : await getCurrentUser()
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  if (!isAdmin(user)) {
    return { user: null, response: NextResponse.json({ error: "Admin access required." }, { status: 403 }) }
  }
  if (request && !isSafeMethod(request.method)) {
    const rateLimitResponse = await enforceApiRateLimit({ userId: user.id, scope: `admin:${request.nextUrl.pathname}`, limit: 60 })
    if (rateLimitResponse) return { user: null, response: rateLimitResponse }
  }
  return { user, response: null }
}

export async function revokeCurrentSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return

  await prisma.session.updateMany({
    where: {
      tokenHash: hashSecret(token, sessionSecret()),
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  })
}

export async function revokeSessionToken(token: string) {
  await prisma.session.updateMany({
    where: {
      tokenHash: hashSecret(token, sessionSecret()),
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  })
}

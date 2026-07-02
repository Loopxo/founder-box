import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, createSession, sessionCookieOptions } from "@/lib/auth"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { exchangeOAuthCode, isOAuthProvider, linkOAuthAccount } from "@/lib/oauth"
import { safeInternalPath } from "@/lib/security"

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params
  if (!isOAuthProvider(provider)) return NextResponse.json({ error: "Unsupported OAuth provider." }, { status: 400 })

  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  const storedState = request.cookies.get("fb_oauth_state")?.value
  if (!code || !state || !storedState) return NextResponse.redirect(new URL("/login?error=oauth", request.url))

  let parsed: { provider?: string; state?: string; next?: string }
  try {
    parsed = JSON.parse(storedState) as { provider?: string; state?: string; next?: string }
  } catch {
    return NextResponse.redirect(new URL("/login?error=state", request.url))
  }
  if (parsed.provider !== provider || parsed.state !== state) return NextResponse.redirect(new URL("/login?error=state", request.url))

  try {
    const profile = await exchangeOAuthCode(provider, code)
    const user = await linkOAuthAccount(profile)
    await ensureWorkspaceForUser(user)
    const session = await createSession(user.id, request)
    const nextPath = safeInternalPath(parsed.next)
    const response = NextResponse.redirect(new URL(nextPath, request.url))
    response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions())
    response.cookies.delete("fb_oauth_state")
    return response
  } catch (error) {
    const url = new URL("/login", request.url)
    url.searchParams.set("error", error instanceof Error ? error.message : "OAuth failed.")
    return NextResponse.redirect(url)
  }
}

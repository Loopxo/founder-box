import { randomBytes } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { buildOAuthAuthorizeUrl, isOAuthProvider } from "@/lib/oauth"
import { safeInternalPath } from "@/lib/security"

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params
  if (!isOAuthProvider(provider)) return NextResponse.json({ error: "Unsupported OAuth provider." }, { status: 400 })

  const state = randomBytes(18).toString("base64url")
  const next = safeInternalPath(request.nextUrl.searchParams.get("next"))
  const response = NextResponse.redirect(buildOAuthAuthorizeUrl(provider, state))
  response.cookies.set("fb_oauth_state", JSON.stringify({ provider, state, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  })
  return response
}

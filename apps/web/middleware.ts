import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE = "fb_session"

export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value)
  if (hasSession) return NextResponse.next()

  const loginUrl = new URL("/login", request.url)
  loginUrl.searchParams.set("next", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/dashboard/:path*", "/accountability/:path*", "/billing", "/account", "/admin/:path*", "/academy/:path*"],
}

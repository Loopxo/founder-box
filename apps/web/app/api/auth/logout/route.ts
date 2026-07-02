import { NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, revokeCurrentSession } from "@/lib/auth"
import { assertSameOrigin } from "@/lib/security"

export async function POST(request: NextRequest) {
  const csrfResponse = assertSameOrigin(request)
  if (csrfResponse) return csrfResponse

  await revokeCurrentSession()
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(SESSION_COOKIE)
  return response
}

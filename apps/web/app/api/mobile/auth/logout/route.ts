import { NextRequest, NextResponse } from "next/server"
import { bearerTokenFromRequest, revokeSessionToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const token = bearerTokenFromRequest(request)
  if (token) await revokeSessionToken(token)
  return NextResponse.json({ ok: true })
}

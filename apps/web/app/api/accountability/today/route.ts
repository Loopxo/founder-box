import { NextRequest, NextResponse } from "next/server"
import { getTodaySnapshot } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const today = await getTodaySnapshot(user)
  return NextResponse.json(today)
}

import { NextRequest, NextResponse } from "next/server"
import { getWeeklySnapshot } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const week = await getWeeklySnapshot(user)
  return NextResponse.json(week)
}

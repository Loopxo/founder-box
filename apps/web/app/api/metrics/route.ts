import { NextResponse } from "next/server"
import { getTodaySnapshot, getWeeklySnapshot, getUserPlan } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"

export async function GET() {
  const { user, response } = await requireCurrentUser()
  if (!user) return response

  const [today, week, plan] = await Promise.all([getTodaySnapshot(user), getWeeklySnapshot(user), getUserPlan(user.id)])
  return NextResponse.json({
    plan,
    today: today.metrics,
    week: week.metrics,
  })
}

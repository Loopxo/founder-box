import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser, upsertDailyReview } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const review = await upsertDailyReview({
    workspaceId: workspace.id,
    userId: user.id,
    wakeUpTime: body.wakeUpTime,
    mood: body.mood,
    energy: body.energy == null ? undefined : Number(body.energy),
    mainGoal: body.mainGoal,
    revenueTaskDone: Boolean(body.revenueTaskDone),
    productTaskDone: Boolean(body.productTaskDone),
    distributionTaskDone: Boolean(body.distributionTaskDone),
    deepWorkMinutes: body.deepWorkMinutes == null ? undefined : Number(body.deepWorkMinutes),
    data: body,
  })

  return NextResponse.json({ review })
}

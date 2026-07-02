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
    revenueTaskDone: Boolean(body.revenueTaskDone),
    productTaskDone: Boolean(body.productTaskDone),
    distributionTaskDone: Boolean(body.distributionTaskDone),
    deepWorkMinutes: body.deepWorkMinutes == null ? undefined : Number(body.deepWorkMinutes),
    biggestOutput: body.biggestOutput,
    methodWorked: body.methodWorked,
    vanished: body.vanished,
    endOfDayReview: body.endOfDayReview,
    data: body,
  })

  return NextResponse.json({ review })
}

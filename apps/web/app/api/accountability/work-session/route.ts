import { NextRequest, NextResponse } from "next/server"
import { createAccountabilityEntry, ensureWorkspaceForUser, logProof } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const entry = await createAccountabilityEntry({
    workspaceId: workspace.id,
    userId: user.id,
    objectKey: "work_sessions",
    systemType: "work_session",
    title: body.project || body.outputCreated || "Work session",
    summary: body.outputCreated,
    values: {
      date: body.date || new Date().toISOString(),
      start_time: body.startTime,
      end_time: body.endTime,
      duration_minutes: body.durationMinutes == null ? undefined : Number(body.durationMinutes),
      project: body.project,
      type: body.type || "Product",
      output_created: body.outputCreated,
      valuable: body.valuable == null ? true : Boolean(body.valuable),
      proof_link: body.proofLink,
    },
  })

  if (body.proofLink) {
    await logProof({ workspaceId: workspace.id, userId: user.id, entryId: entry.id, type: "other", label: body.outputCreated || "Work proof", url: body.proofLink })
  }

  return NextResponse.json({ entry })
}

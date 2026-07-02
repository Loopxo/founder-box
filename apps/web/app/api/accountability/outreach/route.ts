import { NextRequest, NextResponse } from "next/server"
import { createAccountabilityEntry, ensureWorkspaceForUser } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const entry = await createAccountabilityEntry({
    workspaceId: workspace.id,
    userId: user.id,
    objectKey: "outreach_log",
    systemType: "outreach",
    title: body.clientName || body.channel || "Outreach",
    summary: body.messageUsed,
    values: {
      date: body.date || new Date().toISOString(),
      channel: body.channel,
      message_used: body.messageUsed,
      method_used: body.methodUsed,
      personalization_level: body.personalizationLevel,
      offer_sent: body.offerSent,
      reply: Boolean(body.reply),
      outcome: body.outcome || "Sent",
      follow_up_required: Boolean(body.followUpRequired),
    },
  })

  return NextResponse.json({ entry })
}

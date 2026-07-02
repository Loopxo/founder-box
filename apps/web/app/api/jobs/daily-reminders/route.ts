import { NextRequest, NextResponse } from "next/server"
import { writeAuditEvent } from "@/lib/audit"
import { sendDailyReminders } from "@/lib/reminders"

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV !== "production"
  return request.headers.get("x-founderbox-cron-secret") === secret
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const counts = await sendDailyReminders()

  await writeAuditEvent({
    action: "job.daily_reminders.completed",
    metadata: counts,
    request,
  })

  return NextResponse.json({ ok: true, ...counts })
}

import { NextRequest, NextResponse } from "next/server"
import { createAccountabilityEntry, ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { csvToObjects } from "@/lib/csv"
import { readJsonBody } from "@/lib/security"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await readJsonBody<Record<string, unknown>>(request).catch(() => ({} as Record<string, unknown>))
  const csv = typeof body.csv === "string" ? body.csv : ""
  if (!csv.trim()) return NextResponse.json({ error: "CSV text is required." }, { status: 400 })

  const workspace = await ensureWorkspaceForUser(user)
  const rows = csvToObjects(csv).slice(0, 500)
  const entries = []

  for (const row of rows) {
    const entry = await createAccountabilityEntry({
      workspaceId: workspace.id,
      userId: user.id,
      objectKey: "outreach_log",
      systemType: "outreach",
      title: row.client_name || row.client || row.company || row.channel || "Imported outreach",
      summary: row.message_used || row.message || undefined,
      values: {
        date: row.date || new Date().toISOString(),
        channel: row.channel || "Other",
        message_used: row.message_used || row.message,
        method_used: row.method_used || row.method,
        personalization_level: row.personalization_level || row.personalization || "Medium",
        offer_sent: row.offer_sent || row.offer,
        reply: ["true", "yes", "1", "replied"].includes(String(row.reply || row.outcome || "").toLowerCase()),
        outcome: row.outcome || "Sent",
        follow_up_required: ["true", "yes", "1"].includes(String(row.follow_up_required || row.follow_up || "").toLowerCase()),
      },
    })
    entries.push(entry)
  }

  await writeAuditEvent({ action: "outreach.csv_imported", userId: user.id, workspaceId: workspace.id, metadata: { count: entries.length }, request })
  return NextResponse.json({ imported: entries.length })
}


import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { ensureWorkspaceForUser, getWeeklySnapshot } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { assertCanExport } from "@/lib/entitlements"
import { createSimplePdf, entriesToCsv, entriesToXlsx } from "@/lib/export"
import { prisma } from "@/lib/prisma"

const FORMATS = new Set(["json", "csv", "xlsx", "markdown", "pdf"])

function bufferToBody(buffer: Buffer): BodyInit {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
}

export async function GET(request: NextRequest, context: { params: Promise<{ format: string }> }) {
  const { user, response } = await requireCurrentUser()
  if (!user) return response

  const { format } = await context.params
  if (!FORMATS.has(format)) return NextResponse.json({ error: "Unsupported export format." }, { status: 400 })

  const allowed = await assertCanExport(user.id)
  if (!allowed.ok) return NextResponse.json({ error: allowed.reason }, { status: 402 })

  const workspace = await ensureWorkspaceForUser(user)
  const type = request.nextUrl.searchParams.get("type") || "weekly"
  const week = await getWeeklySnapshot(user)
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  let body: BodyInit
  let contentType: string
  let fileName: string

  if (format === "markdown") {
    body = week.markdown
    contentType = "text/markdown; charset=utf-8"
    fileName = "founderbox-weekly-report.md"
  } else if (format === "pdf") {
    body = bufferToBody(createSimplePdf("FounderBox Weekly Proof Report", week.markdown))
    contentType = "application/pdf"
    fileName = "founderbox-weekly-report.pdf"
  } else if (format === "xlsx") {
    body = bufferToBody(entriesToXlsx(week.entries))
    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    fileName = "founderbox-entries.xlsx"
  } else if (format === "csv") {
    body = entriesToCsv(week.entries)
    contentType = "text/csv; charset=utf-8"
    fileName = "founderbox-entries.csv"
  } else {
    body = JSON.stringify({ workspace: { id: workspace.id, name: workspace.name }, weekStart: week.weekStart, metrics: week.metrics, entries: week.entries }, null, 2)
    contentType = "application/json; charset=utf-8"
    fileName = "founderbox-export.json"
  }

  const job = await prisma.exportJob.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      type,
      format,
      status: "completed",
      completedAt: new Date(),
      expiresAt,
      metadata: { fileName } as Prisma.InputJsonValue,
    },
  })
  await writeAuditEvent({ action: "export.created", userId: user.id, workspaceId: workspace.id, entityType: "ExportJob", entityId: job.id, metadata: { format, type }, request })

  return new NextResponse(body, {
    headers: {
      "content-type": contentType,
      "content-disposition": `attachment; filename="${fileName}"`,
    },
  })
}

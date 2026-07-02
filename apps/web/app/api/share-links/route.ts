import { NextRequest, NextResponse } from "next/server"
import { createShareReport, ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { assertCanCreateShareReport } from "@/lib/entitlements"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const workspace = await ensureWorkspaceForUser(user)
  const shareLinks = await prisma.shareLink.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
  return NextResponse.json({ shareLinks })
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const allowed = await assertCanCreateShareReport(user.id, workspace.id)
  if (!allowed.ok) return NextResponse.json({ error: allowed.reason }, { status: 402 })

  const shareLink = await createShareReport(user, {
    title: body.title,
    redacted: body.redacted == null ? true : Boolean(body.redacted),
    weekStart: body.weekStart ? new Date(body.weekStart) : undefined,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
  })

  await writeAuditEvent({ action: "share_link.created", userId: user.id, workspaceId: shareLink.workspaceId, entityType: "ShareLink", entityId: shareLink.id, metadata: { redacted: shareLink.redacted }, request })
  return NextResponse.json({ shareLink, url: `/share/${shareLink.token}` })
}

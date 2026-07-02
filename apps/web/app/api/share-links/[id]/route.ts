import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(_request)
  if (!user) return response

  const { id } = await context.params
  const workspace = await ensureWorkspaceForUser(user)
  const result = await prisma.shareLink.updateMany({
    where: { id, workspaceId: workspace.id, revokedAt: null },
    data: { revokedAt: new Date() },
  })
  if (result.count > 0) {
    await writeAuditEvent({ action: "share_link.revoked", userId: user.id, workspaceId: workspace.id, entityType: "ShareLink", entityId: id, request: _request })
  }
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from "next/server"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeAuditEvent } from "@/lib/audit"

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(_request)
  if (!user) return response

  const { id } = await context.params
  await prisma.apiKey.updateMany({
    where: { id, userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  })
  await writeAuditEvent({ action: "api_key.revoked", userId: user.id, entityType: "ApiKey", entityId: id, request: _request })

  return NextResponse.json({ ok: true })
}

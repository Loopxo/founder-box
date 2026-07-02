import { NextRequest, NextResponse } from "next/server"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { readJsonBody } from "@/lib/security"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await readJsonBody<Record<string, unknown>>(request).catch(() => ({} as Record<string, unknown>))
  if (body.confirm !== user.email) {
    return NextResponse.json({ error: "Type your account email to confirm deletion." }, { status: 400 })
  }

  await writeAuditEvent({ action: "account.delete_requested", userId: user.id, request })
  await prisma.user.delete({ where: { id: user.id } })

  const deleted = NextResponse.json({ ok: true })
  deleted.cookies.delete("fb_session")
  return deleted
}

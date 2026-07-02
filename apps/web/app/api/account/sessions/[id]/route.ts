import { NextRequest, NextResponse } from "next/server"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(_request)
  if (!user) return response

  const { id } = await context.params
  await prisma.session.updateMany({
    where: { id, userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}

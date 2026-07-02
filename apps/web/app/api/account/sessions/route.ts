import { NextRequest, NextResponse } from "next/server"
import { getCurrentSessionFromRequest, requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const current = await getCurrentSessionFromRequest(request)
  const sessions = await prisma.session.findMany({
    where: { userId: user.id },
    orderBy: { lastSeenAt: "desc" },
    select: { id: true, userAgent: true, ipAddress: true, createdAt: true, lastSeenAt: true, expiresAt: true, revokedAt: true },
  })

  return NextResponse.json({
    currentSessionId: current?.id,
    sessions: sessions.map((session) => ({ ...session, current: session.id === current?.id })),
  })
}

export async function DELETE(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const current = await getCurrentSessionFromRequest(request)
  await prisma.session.updateMany({
    where: { userId: user.id, revokedAt: null, id: current ? { not: current.id } : undefined },
    data: { revokedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}

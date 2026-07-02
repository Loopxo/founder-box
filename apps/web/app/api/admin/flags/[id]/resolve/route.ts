import { NextRequest, NextResponse } from "next/server"
import { writeAuditEvent } from "@/lib/audit"
import { requireAdminUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAdminUser(request)
  if (!user) return response

  const { id } = await context.params
  const flag = await prisma.suspiciousUsageFlag.update({
    where: { id },
    data: { status: "resolved", resolvedAt: new Date() },
  })
  await writeAuditEvent({ action: "admin.flag.resolved", userId: user.id, workspaceId: flag.workspaceId, entityType: "SuspiciousUsageFlag", entityId: flag.id, request })
  return NextResponse.json({ flag })
}

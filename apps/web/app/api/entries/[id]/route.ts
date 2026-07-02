import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const entry = await prisma.entry.findFirst({ where: { id, workspaceId: workspace.id } })
  if (!entry) return NextResponse.json({ error: "Entry not found." }, { status: 404 })

  const updated = await prisma.entry.update({
    where: { id },
    data: {
      title: body.title,
      summary: body.summary,
      happenedAt: body.happenedAt ? new Date(body.happenedAt) : undefined,
      data: body.values ? (body.values as Prisma.InputJsonValue) : undefined,
      archivedAt: body.archived === true ? new Date() : body.archived === false ? null : undefined,
    },
  })
  await writeAuditEvent({ action: "entry.updated", userId: user.id, workspaceId: workspace.id, entityType: "Entry", entityId: id, request })
  return NextResponse.json({ entry: updated })
}

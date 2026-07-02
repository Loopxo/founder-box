import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser()
  if (!user) return response

  const { id } = await context.params
  const workspace = await ensureWorkspaceForUser(user)
  const flow = await prisma.flow.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      objects: { include: { fields: { include: { options: true }, orderBy: { sortOrder: "asc" } }, entries: { take: 20, orderBy: { happenedAt: "desc" } } }, orderBy: { sortOrder: "asc" } },
      views: true,
      dashboards: { include: { widgets: { orderBy: { sortOrder: "asc" } } } },
      targets: true,
      metricDefinitions: true,
    },
  })

  if (!flow) return NextResponse.json({ error: "Flow not found." }, { status: 404 })
  return NextResponse.json({ flow })
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const updated = await prisma.flow.updateMany({
    where: { id, workspaceId: workspace.id },
    data: {
      name: body.name,
      description: body.description,
      persona: body.persona,
      isActive: body.isActive,
      archivedAt: body.archived ? new Date() : undefined,
    },
  })

  if (updated.count === 0) return NextResponse.json({ error: "Flow not found." }, { status: 404 })

  const flow = await prisma.flow.update({
    where: { id },
    data: {
      currentVersion: { increment: 1 },
      versions: {
        create: {
          version: await prisma.flowVersion.count({ where: { flowId: id } }).then((count) => count + 1),
          config: {
            change: "flow.updated",
            fields: ["name", "description", "persona", "isActive", "archivedAt"].filter((key) => body[key] !== undefined),
          },
        },
      },
    },
  })

  await writeAuditEvent({ action: body.archived ? "flow.archived" : "flow.updated", userId: user.id, workspaceId: workspace.id, entityType: "Flow", entityId: id, request })
  return NextResponse.json({ flow })
}

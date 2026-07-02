import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { recordFlowVersion } from "@/lib/flow-version"
import { prisma } from "@/lib/prisma"

function keyFromName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "object"
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const flow = await prisma.flow.findFirst({ where: { id, workspaceId: workspace.id } })
  if (!flow) return NextResponse.json({ error: "Flow not found." }, { status: 404 })

  const sortOrder = await prisma.flowObject.count({ where: { flowId: flow.id } })
  const object = await prisma.flowObject.create({
    data: {
      flowId: flow.id,
      key: body.key || keyFromName(body.name || "Object"),
      name: body.name || "Object",
      description: body.description,
      icon: body.icon,
      sortOrder,
    },
  })

  await recordFlowVersion(flow.id, "object.created", { objectId: object.id, key: object.key })
  await writeAuditEvent({ action: "flow_object.created", userId: user.id, workspaceId: workspace.id, entityType: "FlowObject", entityId: object.id, metadata: { flowId: flow.id }, request })
  return NextResponse.json({ object })
}

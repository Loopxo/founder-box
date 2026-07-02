import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
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
      objects: { include: { fields: { include: { options: true } } } },
      views: true,
      targets: true,
      metricDefinitions: true,
      dashboards: { include: { widgets: true } },
    },
  })
  if (!flow) return NextResponse.json({ error: "Flow not found." }, { status: 404 })

  return new NextResponse(JSON.stringify({ version: 1, flow }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${flow.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-flow.json"`,
    },
  })
}

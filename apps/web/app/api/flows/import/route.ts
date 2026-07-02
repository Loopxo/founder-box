import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser, installFlowTemplate } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { assertCanCreateFlow } from "@/lib/entitlements"
import { importExportedFlow } from "@/lib/flow-import"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const allowed = await assertCanCreateFlow(user.id, workspace.id)
  if (!allowed.ok) return NextResponse.json({ error: allowed.reason }, { status: 402 })

  const templateKey = typeof body.templateKey === "string" ? body.templateKey : undefined
  const flow = body.flow ? await importExportedFlow(workspace.id, body) : await installFlowTemplate(workspace.id, templateKey || "solo-dev")
  await writeAuditEvent({ action: "flow.imported", userId: user.id, workspaceId: workspace.id, entityType: "Flow", entityId: flow.id, metadata: { templateKey: templateKey || flow.templateKey, mode: body.flow ? "json" : "template" }, request })
  return NextResponse.json({ flow })
}

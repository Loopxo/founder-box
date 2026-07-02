import { NextRequest, NextResponse } from "next/server"
import { createCheckoutUrl } from "@/lib/billing"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { trackServerEvent } from "@/lib/analytics"
import { requireCurrentUser } from "@/lib/auth"
import { writeAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const workspace = await ensureWorkspaceForUser(user)
  const url = await createCheckoutUrl({ userId: user.id, workspaceId: workspace.id, email: user.email, name: user.name })
  await writeAuditEvent({ action: "billing.checkout.created", userId: user.id, workspaceId: workspace.id, request })
  await trackServerEvent({ event: "billing_checkout_created", userId: user.id, workspaceId: workspace.id })
  return NextResponse.json({ url })
}

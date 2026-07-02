import { NextRequest, NextResponse } from "next/server"
import { createAccountabilityEntry, ensureWorkspaceForUser, logProof } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const entry = await createAccountabilityEntry({
    workspaceId: workspace.id,
    userId: user.id,
    objectKey: "product_progress",
    systemType: "product_progress",
    title: body.product || "Product progress",
    summary: body.featureWorkedOn,
    values: {
      product: body.product,
      feature_worked_on: body.featureWorkedOn,
      stage: body.stage || "Building",
      users_affected: body.usersAffected == null ? undefined : Number(body.usersAffected),
      proof_link: body.proofLink,
      blocker: body.blocker,
      next_action: body.nextAction,
    },
  })

  if (body.proofLink) {
    await logProof({ workspaceId: workspace.id, userId: user.id, entryId: entry.id, type: body.proofType || "deploy", label: body.featureWorkedOn || "Product proof", url: body.proofLink })
  }

  return NextResponse.json({ entry })
}

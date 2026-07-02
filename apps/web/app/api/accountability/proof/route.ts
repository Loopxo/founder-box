import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser, logProof } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const proof = await logProof({
    workspaceId: workspace.id,
    userId: user.id,
    entryId: body.entryId,
    type: body.type || "other",
    label: body.label,
    url: body.url,
    text: body.text,
    fileName: body.fileName,
    mimeType: body.mimeType,
    sizeBytes: body.sizeBytes == null ? undefined : Number(body.sizeBytes),
    metadata: body.metadata,
  })

  await writeAuditEvent({ action: "proof.created", userId: user.id, workspaceId: workspace.id, entityType: "ProofAsset", entityId: proof.id, metadata: { type: proof.type, entryId: proof.entryId }, request })
  return NextResponse.json({ proof })
}

import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { createSignedDownloadUrl, isObjectStorageConfigured } from "@/lib/storage"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const proofId = typeof body.proofId === "string" ? body.proofId : ""
  if (!proofId) return NextResponse.json({ error: "proofId is required." }, { status: 400 })
  if (!isObjectStorageConfigured()) return NextResponse.json({ error: "Object storage is not configured." }, { status: 503 })

  const workspace = await ensureWorkspaceForUser(user)
  const proof = await prisma.proofAsset.findFirst({ where: { id: proofId, workspaceId: workspace.id } })
  if (!proof?.storageKey) return NextResponse.json({ error: "Proof file not found." }, { status: 404 })

  const downloadUrl = await createSignedDownloadUrl(proof.storageKey)
  await writeAuditEvent({ action: "proof.download_url.created", userId: user.id, workspaceId: workspace.id, entityType: "ProofAsset", entityId: proof.id, request })

  return NextResponse.json({ proofId: proof.id, downloadUrl, expiresInSeconds: Number(process.env.S3_SIGNED_DOWNLOAD_TTL_SECONDS || 300) })
}

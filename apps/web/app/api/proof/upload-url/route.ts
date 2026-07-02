import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { createSignedUploadUrl, isObjectStorageConfigured, makeProofStorageKey } from "@/lib/storage"
import { prisma } from "@/lib/prisma"

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
])

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const fileName = typeof body.fileName === "string" ? body.fileName : ""
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : "application/octet-stream"
  const sizeBytes = Number(body.sizeBytes || 0)

  if (!fileName) return NextResponse.json({ error: "fileName is required." }, { status: 400 })
  if (sizeBytes > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Proof file is too large. Max size is 10MB." }, { status: 413 })
  if (!ALLOWED_UPLOAD_TYPES.has(mimeType)) return NextResponse.json({ error: "Unsupported proof file type." }, { status: 415 })
  if (!isObjectStorageConfigured()) return NextResponse.json({ error: "Object storage is not configured. Use URL/text proof in local mode." }, { status: 503 })

  const workspace = await ensureWorkspaceForUser(user)
  const storageKey = makeProofStorageKey({ workspaceId: workspace.id, userId: user.id, fileName })
  const proof = await prisma.proofAsset.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      entryId: typeof body.entryId === "string" ? body.entryId : undefined,
      type: typeof body.type === "string" ? body.type : "other",
      label: typeof body.label === "string" ? body.label : fileName,
      fileName,
      mimeType,
      sizeBytes,
      storageKey,
      metadata: { uploadStatus: "pending" } as Prisma.InputJsonValue,
    },
  })
  const uploadUrl = await createSignedUploadUrl({ key: storageKey, mimeType, sizeBytes })
  await writeAuditEvent({ action: "proof.upload_url.created", userId: user.id, workspaceId: workspace.id, entityType: "ProofAsset", entityId: proof.id, request })

  return NextResponse.json({ proof, uploadUrl, expiresInSeconds: Number(process.env.S3_SIGNED_UPLOAD_TTL_SECONDS || 900) })
}

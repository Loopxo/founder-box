import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const { id } = await context.params
  const workspace = await ensureWorkspaceForUser(user)
  const proof = await prisma.proofAsset.findFirst({ where: { id, workspaceId: workspace.id, userId: user.id } })
  if (!proof) return NextResponse.json({ error: "Proof asset not found." }, { status: 404 })

  const updated = await prisma.proofAsset.update({
    where: { id },
    data: {
      metadata: {
        ...(proof.metadata && typeof proof.metadata === "object" && !Array.isArray(proof.metadata) ? proof.metadata : {}),
        uploadStatus: "completed",
        uploadedAt: new Date().toISOString(),
      } as Prisma.InputJsonValue,
    },
  })
  await writeAuditEvent({ action: "proof.upload.completed", userId: user.id, workspaceId: workspace.id, entityType: "ProofAsset", entityId: id, request })
  return NextResponse.json({ proof: updated })
}


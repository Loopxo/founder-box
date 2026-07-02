import { readFile } from "node:fs/promises"
import path from "node:path"
import { NextRequest, NextResponse } from "next/server"
import { verifyArtifactDownload } from "@/lib/artifact-token"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSignedDownloadUrl, isObjectStorageConfigured } from "@/lib/storage"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const artifact = await prisma.artifact.findFirst({
    where: {
      id,
      expiresAt: { gt: new Date() },
    },
  })

  if (!artifact) {
    return NextResponse.json({ error: "Artifact not found or expired." }, { status: 404 })
  }

  if (artifact.userId) {
    const user = await getCurrentUser()
    const tokenOk = verifyArtifactDownload(artifact.id, artifact.expiresAt, request.nextUrl.searchParams.get("token"))
    if (user?.id !== artifact.userId && !tokenOk) {
      return NextResponse.json({ error: "Artifact access denied." }, { status: 403 })
    }
  }

  if (/^https?:\/\//.test(artifact.storageKey)) {
    return NextResponse.redirect(artifact.storageKey)
  }

  if (!path.isAbsolute(artifact.storageKey) && isObjectStorageConfigured()) {
    return NextResponse.redirect(await createSignedDownloadUrl(artifact.storageKey))
  }

  const file = await readFile(artifact.storageKey)
  return new NextResponse(new Uint8Array(file), {
    headers: {
      "content-type": artifact.mimeType,
      "content-disposition": `inline; filename="${artifact.name.replace(/"/g, "")}"`,
      "cache-control": "private, max-age=60",
    },
  })
}

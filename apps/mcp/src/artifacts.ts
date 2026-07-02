import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { createHmac, randomUUID } from "node:crypto"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import type { ArtifactType, FounderBoxArtifact } from "@founderbox/core"
import { prisma } from "./db.js"
import type { McpRequestContext } from "./context.js"

const ARTIFACT_TTL_DAYS = Number(process.env.FOUNDERBOX_ARTIFACT_TTL_DAYS || 7)

function artifactRoot() {
  return process.env.FOUNDERBOX_ARTIFACT_DIR || path.join(process.cwd(), ".founderbox", "artifacts")
}

function webUrl() {
  return process.env.FOUNDERBOX_WEB_URL || "http://localhost:3000"
}

function artifactToken(id: string, expiresAt: Date) {
  const secret = process.env.ARTIFACT_TOKEN_SECRET || process.env.API_KEY_HASH_SECRET || process.env.SESSION_SECRET || "founderbox-dev-artifact-secret"
  return createHmac("sha256", secret).update(`${id}:${expiresAt.toISOString()}`).digest("base64url")
}

export function artifactDownloadUrl(id: string, expiresAt: Date) {
  return `${webUrl()}/api/artifacts/${id}?token=${artifactToken(id, expiresAt)}`
}

function objectStorageConfigured() {
  return Boolean(process.env.S3_ENDPOINT && process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)
}

function s3Client() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  })
}

async function persistContent(input: { id: string; name: string; userId?: string; content: Buffer; mimeType: string }) {
  const safeName = input.name.replace(/[^a-z0-9._-]/gi, "_")

  if (objectStorageConfigured()) {
    const key = `artifacts/${input.userId || "anonymous"}/${input.id}-${safeName}`
    await s3Client().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: input.content,
        ContentType: input.mimeType,
      }),
    )
    return key
  }

  const dir = artifactRoot()
  await mkdir(dir, { recursive: true })
  const filePath = path.join(dir, `${input.id}-${safeName}`)
  await writeFile(filePath, input.content)
  return filePath
}

export async function saveArtifact(input: {
  context?: McpRequestContext
  name: string
  type: ArtifactType
  mimeType: string
  content: Buffer | string
}): Promise<FounderBoxArtifact> {
  const id = randomUUID()
  const content = typeof input.content === "string" ? Buffer.from(input.content) : input.content
  const expiresAt = new Date(Date.now() + ARTIFACT_TTL_DAYS * 24 * 60 * 60 * 1000)
  const userId = input.context?.userId && input.context.userId !== "dev-user" ? input.context.userId : undefined
  const storageKey = await persistContent({ id, name: input.name, userId, content, mimeType: input.mimeType })

  if (userId) {
    await prisma.artifact.create({
      data: {
        id,
        name: input.name,
        type: input.type,
        mimeType: input.mimeType,
        storageKey,
        sizeBytes: content.byteLength,
        expiresAt,
        userId,
      },
    })
  }

  return {
    id,
    name: input.name,
    type: input.type,
    mimeType: input.mimeType,
    url: artifactDownloadUrl(id, expiresAt),
    expiresAt: expiresAt.toISOString(),
  }
}

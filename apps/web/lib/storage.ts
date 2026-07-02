import { randomUUID } from "node:crypto"
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export function isObjectStorageConfigured() {
  return Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_ENDPOINT)
}

function s3Client() {
  if (!isObjectStorageConfigured()) {
    throw new Error("Object storage is not configured. Set S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY.")
  }

  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  })
}

export function makeProofStorageKey(input: { workspaceId: string; userId: string; fileName: string }) {
  const safeName = input.fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "proof-file"
  return `proof/${input.workspaceId}/${input.userId}/${randomUUID()}-${safeName}`
}

export async function createSignedUploadUrl(input: { key: string; mimeType: string; sizeBytes?: number }) {
  const client = s3Client()
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: input.key,
    ContentType: input.mimeType,
    ContentLength: input.sizeBytes,
  })

  return getSignedUrl(client, command, { expiresIn: Number(process.env.S3_SIGNED_UPLOAD_TTL_SECONDS || 900) })
}

export async function createSignedDownloadUrl(key: string) {
  const client = s3Client()
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  })

  return getSignedUrl(client, command, { expiresIn: Number(process.env.S3_SIGNED_DOWNLOAD_TTL_SECONDS || 300) })
}

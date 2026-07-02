import crypto from "node:crypto"

function artifactSecret() {
  return process.env.ARTIFACT_TOKEN_SECRET || process.env.API_KEY_HASH_SECRET || process.env.SESSION_SECRET || "founderbox-dev-artifact-secret"
}

export function signArtifactDownload(id: string, expiresAt: Date | string) {
  return crypto.createHmac("sha256", artifactSecret()).update(`${id}:${new Date(expiresAt).toISOString()}`).digest("base64url")
}

export function verifyArtifactDownload(id: string, expiresAt: Date | string, token?: string | null) {
  if (!token) return false
  const expected = Buffer.from(signArtifactDownload(id, expiresAt))
  const actual = Buffer.from(token)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}


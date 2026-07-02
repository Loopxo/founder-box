import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto"

function base64Url(bytes: Buffer) {
  return bytes.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

export function createOtpCode() {
  return randomInt(100000, 1000000).toString()
}

export function createSessionToken() {
  return `fbs_${base64Url(randomBytes(32))}`
}

export function createApiKey(prefix = "fb_live") {
  return `${prefix}_${base64Url(randomBytes(32))}`
}

export function hashSecret(value: string, pepper = "") {
  if (pepper) {
    return createHmac("sha256", pepper).update(value).digest("hex")
  }

  return createHash("sha256").update(value).digest("hex")
}

export function safeCompareHash(value: string, expectedHash: string, pepper = "") {
  const actualHash = hashSecret(value, pepper)
  const actual = Buffer.from(actualHash, "hex")
  const expected = Buffer.from(expectedHash, "hex")
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function getApiKeyPrefix(apiKey: string) {
  return apiKey.slice(0, 16)
}

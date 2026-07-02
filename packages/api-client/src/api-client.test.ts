import { describe, expect, it } from "vitest"
import { FounderBoxApiError, FounderBoxClient, makeIdempotencyKey } from "./index"

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), { headers: { "content-type": "application/json" }, ...init })
}

describe("FounderBoxClient", () => {
  it("adds bearer auth and serializes JSON bodies", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = []
    const client = new FounderBoxClient({
      baseUrl: "https://founderbox.test/",
      getAccessToken: () => "fbs_test",
      fetcher: async (url, init) => {
        calls.push({ url: String(url), init })
        return jsonResponse({ ok: true, expiresAt: "soon" })
      },
    })

    await client.requestOtp("founder@example.com")

    expect(calls[0].url).toBe("https://founderbox.test/api/mobile/auth/request-otp")
    expect(calls[0].init?.method).toBe("POST")
    expect((calls[0].init?.headers as Record<string, string>).authorization).toBe("Bearer fbs_test")
    expect(calls[0].init?.body).toBe(JSON.stringify({ email: "founder@example.com" }))
  })

  it("normalizes API errors", async () => {
    const client = new FounderBoxClient({
      baseUrl: "https://founderbox.test",
      fetcher: async () => jsonResponse({ error: "Nope", code: "bad_request" }, { status: 400 }),
    })

    await expect(client.me()).rejects.toMatchObject<Partial<FounderBoxApiError>>({
      name: "FounderBoxApiError",
      status: 400,
      body: { error: "Nope", code: "bad_request" },
    })
  })

  it("creates idempotency keys", () => {
    expect(makeIdempotencyKey()).toMatch(/^fbop_/)
  })
})

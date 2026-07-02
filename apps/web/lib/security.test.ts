import { describe, expect, it } from "vitest"
import { NextRequest } from "next/server"
import { assertSameOrigin, readJsonBody, safeInternalPath } from "./security"

describe("web security helpers", () => {
  it("allows same-origin mutating requests", () => {
    const request = new NextRequest("http://localhost:3000/api/example", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    })

    expect(assertSameOrigin(request)).toBeNull()
  })

  it("rejects cross-origin mutating requests", () => {
    const request = new NextRequest("http://localhost:3000/api/example", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    })

    expect(assertSameOrigin(request)?.status).toBe(403)
  })

  it("keeps OAuth next redirects internal", () => {
    expect(safeInternalPath("/accountability/today?tab=work")).toBe("/accountability/today?tab=work")
    expect(safeInternalPath("//evil.example")).toBe("/accountability/today")
    expect(safeInternalPath("https://evil.example")).toBe("/accountability/today")
  })

  it("reads JSON bodies with a size cap", async () => {
    const request = new NextRequest("http://localhost:3000/api/example", {
      method: "POST",
      body: JSON.stringify({ ok: true }),
    })

    await expect(readJsonBody(request, 100)).resolves.toEqual({ ok: true })
  })
})


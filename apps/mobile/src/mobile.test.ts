import { describe, expect, it } from "vitest"
import { colors, formatMinutes } from "./theme"

describe("mobile theme utilities", () => {
  it("keeps the FounderBox premium dark palette", () => {
    expect(colors.background).toBe("#050506")
    expect(colors.primary).toBe("#0A84FF")
  })

  it("formats proof/deep-work minutes", () => {
    expect(formatMinutes(45)).toBe("45m")
    expect(formatMinutes(120)).toBe("2h")
    expect(formatMinutes(145)).toBe("2h 25m")
  })
})

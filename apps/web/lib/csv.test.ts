import { describe, expect, it } from "vitest"
import { csvToObjects, parseCsv } from "./csv"

describe("csv parser", () => {
  it("parses quoted CSV cells", () => {
    expect(parseCsv('name,note\n"Loopxo, Inc","sent ""warm"" intro"')).toEqual([
      ["name", "note"],
      ["Loopxo, Inc", 'sent "warm" intro'],
    ])
  })

  it("maps CSV headers to normalized object keys", () => {
    expect(csvToObjects("Client Name,Follow Up\nAcme,true")).toEqual([{ client_name: "Acme", follow_up: "true" }])
  })
})


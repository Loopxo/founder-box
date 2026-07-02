const endpoint = process.env.FOUNDERBOX_MCP_URL || "http://localhost:8787/mcp"
const apiKey = process.env.FOUNDERBOX_SMOKE_API_KEY || process.env.FOUNDERBOX_DEV_API_KEY

if (!apiKey) {
  console.error("Set FOUNDERBOX_SMOKE_API_KEY or FOUNDERBOX_DEV_API_KEY.")
  process.exit(1)
}

async function post(payload) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
      "mcp-protocol-version": "2025-06-18",
    },
    body: JSON.stringify(payload),
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${text}`)
  return text
}

await post({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "founderbox-smoke", version: "0.1.0" },
  },
})

await post({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} })

console.log(`MCP smoke passed for ${endpoint}`)


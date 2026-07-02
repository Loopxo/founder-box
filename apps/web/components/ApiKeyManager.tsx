"use client"

import { FormEvent, useEffect, useState } from "react"

interface ApiKeyRow {
  id: string
  name: string
  prefix: string
  createdAt: string
  lastUsedAt?: string | null
  revokedAt?: string | null
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([])
  const [name, setName] = useState("Claude/Cursor")
  const [createdKey, setCreatedKey] = useState("")
  const [message, setMessage] = useState("")

  async function loadKeys() {
    const response = await fetch("/api/api-keys")
    if (!response.ok) return
    const payload = await response.json()
    setKeys(payload.keys || [])
  }

  useEffect(() => {
    loadKeys()
  }, [])

  async function createKey(event: FormEvent) {
    event.preventDefault()
    setMessage("")
    const response = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    })
    const payload = await response.json()
    if (!response.ok) {
      setMessage(payload.error || "Could not create API key.")
      return
    }
    setCreatedKey(payload.key)
    await loadKeys()
  }

  async function revokeKey(id: string) {
    await fetch(`/api/api-keys/${id}`, { method: "DELETE" })
    await loadKeys()
  }

  const displayKey = createdKey || "fb_live_xxxxx"

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <form onSubmit={createKey} style={{ border: "1px solid #2A2A38", borderRadius: 8, background: "#18181F", padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#EDE9DC", marginBottom: 8 }}>Create API key</h2>
        <p style={{ color: "#9E9880", fontSize: 13, marginBottom: 16 }}>Keys are shown once. Store it in your MCP client config when created.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input value={name} onChange={(event) => setName(event.target.value)} style={{ flex: "1 1 260px", background: "#111118", border: "1px solid #2A2A38", color: "#EDE9DC", borderRadius: 6, padding: "11px 12px" }} />
          <button style={{ background: "#D4A853", color: "#111118", border: 0, borderRadius: 6, padding: "11px 16px", fontWeight: 800 }}>Create key</button>
        </div>
        {createdKey && (
          <pre style={{ marginTop: 16, whiteSpace: "pre-wrap", background: "#111118", border: "1px solid #2A2A38", borderRadius: 6, color: "#D4A853", padding: 14 }}>{createdKey}</pre>
        )}
        {message && <p style={{ color: "#D4A853", fontSize: 13, marginTop: 12 }}>{message}</p>}
      </form>

      <section style={{ border: "1px solid #2A2A38", borderRadius: 8, background: "#18181F", padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#EDE9DC", marginBottom: 12 }}>Install snippets</h2>
        <pre style={{ whiteSpace: "pre-wrap", background: "#111118", border: "1px solid #2A2A38", borderRadius: 6, color: "#EDE9DC", padding: 14 }}>{`claude mcp add founderbox --transport http https://mcp.founderbox.loopxo.org/mcp --header "Authorization: Bearer ${displayKey}"`}</pre>
        <pre style={{ whiteSpace: "pre-wrap", background: "#111118", border: "1px solid #2A2A38", borderRadius: 6, color: "#EDE9DC", padding: 14, marginTop: 12 }}>{`{
  "mcpServers": {
    "founderbox": {
      "url": "https://mcp.founderbox.loopxo.org/mcp",
      "headers": {
        "Authorization": "Bearer ${displayKey}"
      }
    }
  }
}`}</pre>
      </section>

      <section style={{ border: "1px solid #2A2A38", borderRadius: 8, background: "#18181F", padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#EDE9DC", marginBottom: 12 }}>Keys</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {keys.map((key) => (
            <div key={key.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, borderTop: "1px solid #2A2A38", paddingTop: 12 }}>
              <div>
                <p style={{ color: "#EDE9DC", fontWeight: 700 }}>{key.name}</p>
                <p style={{ color: "#9E9880", fontSize: 12 }}>{key.prefix}... {key.revokedAt ? "revoked" : "active"}</p>
              </div>
              {!key.revokedAt && <button onClick={() => revokeKey(key.id)} style={{ background: "transparent", color: "#D4A853", border: "1px solid #3A3830", borderRadius: 6, padding: "8px 10px" }}>Revoke</button>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

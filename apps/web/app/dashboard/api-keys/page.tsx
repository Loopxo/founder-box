import DashboardLayout from "@/components/DashboardLayout"
import ApiKeyManager from "@/components/ApiKeyManager"

export default function ApiKeysPage() {
  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <p className="studio-label" style={{ marginBottom: 6 }}>MCP Access</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#EDE9DC", lineHeight: 1.2 }}>API keys</h1>
        <p style={{ color: "#9E9880", marginTop: 6, fontSize: 14 }}>
          Connect FounderBox to Claude Code, Cursor, Codex, Windsurf, or any Streamable HTTP MCP-compatible client.
        </p>
      </div>
      <ApiKeyManager />
    </DashboardLayout>
  )
}

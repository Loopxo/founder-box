import Link from "next/link"

interface DocsArticleProps {
  title: string
  eyebrow: string
  children: React.ReactNode
}

export default function DocsArticle({ title, eyebrow, children }: DocsArticleProps) {
  return (
    <main style={{ minHeight: "100vh", background: "#111118", color: "#EDE9DC", padding: "48px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <nav style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 40, fontSize: 13 }}>
          {[
            ["/docs/mcp", "MCP"],
            ["/docs/api-keys", "API Keys"],
            ["/docs/skills", "Skills"],
            ["/docs/self-host", "Self-host"],
            ["/docs/tool-reference", "Tools"],
            ["/docs/free-limits", "Free limits"],
          ].map(([href, label]) => (
            <Link key={href} href={href} style={{ color: "#D4A853", textDecoration: "none" }}>{label}</Link>
          ))}
        </nav>
        <p style={{ color: "#D4A853", fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{eyebrow}</p>
        <h1 style={{ fontSize: 42, lineHeight: 1.05, fontWeight: 900, marginBottom: 24 }}>{title}</h1>
        <article style={{ color: "#C9C1A7", lineHeight: 1.75, fontSize: 15 }}>{children}</article>
      </div>
    </main>
  )
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{ whiteSpace: "pre-wrap", background: "#18181F", border: "1px solid #2A2A38", borderRadius: 8, padding: 18, color: "#EDE9DC", overflowX: "auto" }}>{children}</pre>
  )
}

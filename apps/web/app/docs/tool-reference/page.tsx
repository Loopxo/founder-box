import DocsArticle from "@/components/DocsArticle"
import { FOUNDERBOX_TOOLS } from "@founderbox/core"

export default function ToolReferenceDocsPage() {
  return (
    <DocsArticle eyebrow="Docs" title="Tool reference">
      <div style={{ display: "grid", gap: 10 }}>
        {FOUNDERBOX_TOOLS.map((tool) => (
          <div key={tool.name} style={{ border: "1px solid #2A2A38", borderRadius: 8, background: "#18181F", padding: 16 }}>
            <p style={{ color: "#EDE9DC", fontWeight: 800, marginBottom: 4 }}>{tool.name}</p>
            <p style={{ margin: 0 }}>{tool.section} - {tool.phase.toUpperCase()} - {tool.description}</p>
          </div>
        ))}
      </div>
    </DocsArticle>
  )
}

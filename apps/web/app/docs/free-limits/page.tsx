import DocsArticle from "@/components/DocsArticle"

export default function FreeLimitsDocsPage() {
  return (
    <DocsArticle eyebrow="Docs" title="Hosted free limits">
      <p>The hosted MCP server is free with limits that protect infrastructure.</p>
      <ul>
        <li>500 text tool calls per day per user.</li>
        <li>20 PDF renders per day per user.</li>
        <li>Generated artifacts expire after 7 days.</li>
        <li>Self-host mode can disable limits with <code>FOUNDERBOX_DISABLE_LIMITS=true</code>.</li>
      </ul>
    </DocsArticle>
  )
}

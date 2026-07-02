import DocsArticle, { CodeBlock } from "@/components/DocsArticle"

export default function McpDocsPage() {
  return (
    <DocsArticle eyebrow="Docs" title="FounderBox MCP">
      <p>FounderBox exposes founder tools through a hosted Streamable HTTP MCP endpoint.</p>
      <CodeBlock>{`claude mcp add founderbox --transport http https://mcp.founderbox.loopxo.org/mcp --header "Authorization: Bearer fb_live_xxxxx"`}</CodeBlock>
      <CodeBlock>{`{
  "mcpServers": {
    "founderbox": {
      "url": "https://mcp.founderbox.loopxo.org/mcp",
      "headers": {
        "Authorization": "Bearer fb_live_xxxxx"
      }
    }
  }
}`}</CodeBlock>
      <p>V1 focuses on Resume Forge, Proposal Generator, and Startup Lens. The MCP server also exposes the catalog for planned V2 modules.</p>
    </DocsArticle>
  )
}

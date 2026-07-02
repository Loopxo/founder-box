import DocsArticle, { CodeBlock } from "@/components/DocsArticle"

export default function SelfHostDocsPage() {
  return (
    <DocsArticle eyebrow="Docs" title="Self-hosting">
      <p>FounderBox is designed to stay free forever by offering hosted free limits and unlimited self-hosting.</p>
      <CodeBlock>{`DATABASE_URL=postgresql://postgres:postgres@localhost:5432/founderbox
SESSION_SECRET=change-me
API_KEY_HASH_SECRET=change-me
RESEND_API_KEY=
RESEND_FROM_EMAIL=
FOUNDERBOX_DISABLE_LIMITS=true
FOUNDERBOX_WEB_URL=http://localhost:3000
FOUNDERBOX_MCP_URL=http://localhost:8787/mcp`}</CodeBlock>
      <p>Dockerfiles and compose wiring are planned next so web, MCP, Postgres, and local artifact storage boot together.</p>
    </DocsArticle>
  )
}

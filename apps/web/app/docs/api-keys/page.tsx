import DocsArticle from "@/components/DocsArticle"

export default function ApiKeysDocsPage() {
  return (
    <DocsArticle eyebrow="Docs" title="API keys">
      <p>Sign in with Resend email OTP, open the dashboard API key page, create a key, and copy it once into your AI client config.</p>
      <p>Keys use the format <code>fb_live_xxxxx</code>. FounderBox stores only a hash, so the full value cannot be recovered later.</p>
      <p>Revoked keys stop working immediately for hosted MCP requests.</p>
    </DocsArticle>
  )
}

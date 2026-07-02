import Link from "next/link"

const installCommand =
  'claude mcp add founderbox --transport http https://mcp.founderbox.loopxo.org/mcp --header "Authorization: Bearer fb_live_xxxxx"'

const tools = [
  "Resume Forge",
  "Proposal Generator",
  "Startup Lens",
  "Launchpath Atlas",
  "Cold Emails",
  "Competitive Analysis",
  "Contracts",
  "Invoices",
  "SEO Content",
  "Sales Copy",
  "Social Media",
]

const skills = [
  "resume creator",
  "proposal writer",
  "startup lens analyst",
  "launchpath coach",
  "cold outreach",
  "developer",
]

export default function McpLandingSection() {
  return (
    <section className="bg-[#111118] border-t border-[#2A2A38] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#D4A853] mb-4">MCP + AI Skills</p>
            <h2 className="font-sans text-4xl sm:text-5xl font-bold text-[#EDE9DC] leading-tight">
              Founder tools inside your AI agent.
            </h2>
            <p className="font-mono text-sm text-[#9E9880] leading-relaxed mt-5 max-w-xl">
              Connect FounderBox to Claude Code, Cursor, Codex, Windsurf, or any MCP-compatible client. Generate resumes, proposals, startup analysis, and founder workflows without leaving your editor.
            </p>
            <div className="grid grid-cols-3 gap-px bg-[#2A2A38] border border-[#2A2A38] rounded-lg overflow-hidden mt-8 max-w-lg">
              {[
                ["50+", "tools planned"],
                ["12", "skills"],
                ["free", "hosted tier"],
              ].map(([value, label]) => (
                <div key={label} className="bg-[#18181F] p-4">
                  <p className="text-[#EDE9DC] text-2xl font-bold">{value}</p>
                  <p className="text-[#9E9880] text-xs uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/dashboard/api-keys" className="inline-flex items-center justify-center px-5 py-3 bg-[#D4A853] text-[#111118] font-mono text-xs font-bold uppercase tracking-widest rounded-sm">
                Get API Key
              </Link>
              <Link href="/docs/mcp" className="inline-flex items-center justify-center px-5 py-3 border border-[#3A3830] text-[#D4A853] font-mono text-xs font-bold uppercase tracking-widest rounded-sm">
                MCP Docs
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="border border-[#2A2A38] rounded-lg bg-[#18181F] p-5">
              <p className="font-mono text-xs uppercase tracking-widest text-[#9E9880] mb-3">Terminal</p>
              <pre className="whitespace-pre-wrap break-words rounded bg-[#111118] border border-[#2A2A38] p-4 text-sm text-[#EDE9DC]">{installCommand}</pre>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-[#2A2A38] rounded-lg bg-[#18181F] p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-[#D4A853] mb-3">Tool modules</p>
                <ul className="space-y-2">
                  {tools.map((tool) => (
                    <li key={tool} className="font-mono text-sm text-[#EDE9DC]">{tool}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-[#2A2A38] rounded-lg bg-[#18181F] p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-[#D4A853] mb-3">AI skills</p>
                <ul className="space-y-2">
                  {skills.map((skill) => (
                    <li key={skill} className="font-mono text-sm text-[#EDE9DC]">{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

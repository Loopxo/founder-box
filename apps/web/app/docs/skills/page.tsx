import DocsArticle, { CodeBlock } from "@/components/DocsArticle"

export default function SkillsDocsPage() {
  return (
    <DocsArticle eyebrow="Docs" title="AI skills">
      <p>FounderBox skills teach agents when to call each MCP tool and what good founder-grade output looks like.</p>
      <CodeBlock>{`packages/skills/skills/
  founderbox-resume-creator/SKILL.md
  founderbox-proposal-writer/SKILL.md
  founderbox-startup-lens-analyst/SKILL.md
  founderbox-developer/SKILL.md`}</CodeBlock>
      <p>Install docs are included in the skill package README for Claude Code, Cursor, Codex, Windsurf, and manual copying.</p>
    </DocsArticle>
  )
}

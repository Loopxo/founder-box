# FounderBox Skills Install

Use these folders with any agent that supports local or remote skills.

Accountability skills:

- `founderbox-accountability-coach`
- `founderbox-solo-dev-operator`
- `founderbox-agency-owner-operator`
- `founderbox-freelancer-operator`
- `founderbox-outreach-analyst`
- `founderbox-weekly-review`

Founder tool skills:

- `founderbox-resume-creator`
- `founderbox-proposal-writer`
- `founderbox-startup-lens-analyst`
- `founderbox-launchpath-coach`
- `founderbox-cold-outreach`
- `founderbox-competitive-analyst`
- `founderbox-contract-drafter`
- `founderbox-invoice-operator`
- `founderbox-seo-strategist`
- `founderbox-sales-operator`
- `founderbox-social-growth`
- `founderbox-developer`

## Claude Code

```bash
npx skills add founderbox/founderbox-skills
```

## Cursor

Copy `packages/skills/skills/*` into `.cursor/skills/` or add them as remote rules when published.

## Codex

Copy the desired skill folders into `$CODEX_HOME/skills/`.

## Windsurf

Copy the desired skill folders into the configured Windsurf skills/rules directory.

## Manual

```bash
cp -r packages/skills/skills/* ~/.founderbox/skills/
```

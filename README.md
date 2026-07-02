# FounderBox

FounderBox is a solo-operator accountability OS, founder tool suite, and hosted MCP server.

The main product helps solo devs, indie hackers, freelancers, agency owners, and solo founders prove what actually happened today: revenue attempts, shipped outputs, outreach experiments, work sessions, product progress, proof links, and weekly accountability reports.

Founder Tools remain available as a secondary suite, and the MCP server lets Claude Code, Cursor, Codex, Windsurf, and other MCP-compatible agents call FounderBox workflows directly.

## Product Direction

- Main dashboard: Accountability OS
- Secondary section: Founder Tools
- Hosted MCP endpoint: `https://mcp.founderbox.loopxo.org/mcp`
- Auth: Google, GitHub, and Resend email OTP
- Billing: Lemon Squeezy
- Mobile: Expo React Native for iOS and Android, with mobile IAP planned through RevenueCat
- Database: Postgres + Prisma
- Files/artifacts: Cloudflare R2 or S3-compatible storage in production, local filesystem in dev/self-host mode
- API keys with the `fb_live_xxxxx` format
- Free hosted usage limits to protect infrastructure, with $8/month Founding Pro
- Unlimited self-hosting mode where limits can be disabled
- Shared core package for web and MCP generation logic
- Installable skills that teach AI agents how to use FounderBox tools well

## Workspace

```txt
founder-box/
  apps/
    web/       Next.js dashboard, accountability OS, auth, billing, docs, admin
    mcp/       Express Streamable HTTP MCP server
    mobile/    Expo iOS/Android app for mobile accountability capture
  packages/
    api-client/ Shared typed client for mobile and future SDK surfaces
    core/      Shared FounderBox business logic
    skills/    AI skill folders and install docs
  prisma/      Postgres schema, migrations, and seed script
```

## Accountability OS

Core metrics:

- Revenue Attempts: outreach, follow-ups, replies, calls booked, proposals sent, deals closed
- Shipped Outputs: deployed features, proof links, deliverables, proposals, content, bug fixes, product progress

Starter flows:

- Solo Dev
- Indie Hacker
- Agency Owner
- Freelancer
- Client Outreach Sprint
- Product Shipping Sprint
- Personal Discipline Reset

## V1 MCP Tools

Accountability tools:

- `accountability_get_today`
- `accountability_start_day`
- `accountability_log_outreach`
- `accountability_log_work_session`
- `accountability_log_product_progress`
- `accountability_log_proof`
- `accountability_end_day_review`
- `accountability_get_weekly_report`
- `accountability_list_flows`
- `accountability_create_entry`
- `accountability_query_metrics`
- `accountability_create_share_report`

Founder tool milestone:

- Resume Forge: `resume_generate`, `resume_optimize_for_job`, `resume_score_ats`, `resume_render_pdf`
- Proposal Generator: `proposal_generate`, `proposal_estimate_pricing`, `proposal_bulk_generate`, `proposal_render_pdf`
- Startup Lens: `startup_lens_create_framework`, `startup_lens_analyze_notes`, `startup_lens_generate_report`, `startup_lens_render_pdf`

The MCP catalog also exposes Launchpath Atlas, Cold Emails, Competitive Analysis, Contracts, Invoices, SEO, Sales Copy, Social Media, dashboard utilities, and skills.

## Quick Start

```bash
pnpm install
pnpm db:seed
pnpm dev
```

Run the MCP server:

```bash
FOUNDERBOX_DEV_API_KEY=fb_live_dev pnpm dev:mcp
```

Connect a local MCP client:

```bash
claude mcp add founderbox --transport http http://localhost:8787/mcp --header "Authorization: Bearer fb_live_dev"
```

Run the mobile app:

```bash
pnpm dev:mobile
```

For mobile on a physical device, set `EXPO_PUBLIC_FOUNDERBOX_API_URL` to a reachable web API URL instead of `localhost`.

## Environment

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/founderbox
SESSION_SECRET=change-me
API_KEY_HASH_SECRET=change-me
AUDIT_HASH_SECRET=change-me
CRON_SECRET=change-me
RESEND_API_KEY=
RESEND_FROM_EMAIL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
LEMONSQUEEZY_FOUNDING_PRO_VARIANT_ID=
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
FOUNDERBOX_WEB_URL=http://localhost:3000
FOUNDERBOX_MCP_URL=http://localhost:8787/mcp
EXPO_PUBLIC_FOUNDERBOX_API_URL=http://localhost:3000
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
FOUNDERBOX_DISABLE_LIMITS=false
FOUNDERBOX_ARTIFACT_DIR=.founderbox/artifacts
```

## Hosted Limits

- 1 workspace
- 1 active custom flow
- 30-day history
- limited share reports and exports
- limited accountability MCP usage
- 500 general text tool calls per day per user
- 20 PDF renders per day per user
- 7-day generated artifact expiry
- Self-host mode can disable limits with `FOUNDERBOX_DISABLE_LIMITS=true`

## Development Commands

```bash
pnpm check:all
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:migrate
pnpm db:studio
pnpm dev:mobile
pnpm check:mobile
```

## Tech Stack

- Next.js 15 and React 19 for the web dashboard
- Expo React Native for the iOS and Android app
- Express and the official MCP TypeScript SDK for the hosted MCP server
- Prisma and Postgres for users, sessions, API keys, runs, artifacts, billing, flows, entries, audit events, and limits
- Resend for passwordless email OTP
- Lemon Squeezy for hosted checkout and customer portal
- Cloudflare R2/S3-compatible storage for hosted artifacts and uploads
- Local filesystem artifacts for self-hosting/dev

## License

MIT

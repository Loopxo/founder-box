# FounderBox Architecture

FounderBox is a pnpm workspace:

- `apps/web`: Next.js dashboard, accountability OS, auth, billing, admin, docs, and artifact access.
- `apps/mcp`: hosted Streamable HTTP MCP server for AI clients.
- `packages/core`: shared deterministic business logic, metrics, templates, and result envelopes.
- `packages/skills`: installable AI skill folders.
- `prisma`: Postgres schema, migrations, and seed script.

## Storage

Postgres + Prisma is the source of truth. Cloudflare R2 is production object storage for proof uploads, generated PDFs, and exports. Local/self-host mode can use filesystem artifact storage where implemented.

## Production Stack

- Web: Vercel
- MCP: Railway
- Jobs: Railway scheduled service hitting protected job endpoints
- Database: Neon Postgres
- Object storage: Cloudflare R2 using S3-compatible env vars
- Email OTP: Resend
- Billing: Lemon Squeezy
- Observability: Sentry, Better Stack, PostHog

## Required Checks

Run before deployment:

```bash
pnpm check:all
pnpm exec prisma migrate deploy --schema prisma/schema.prisma
```

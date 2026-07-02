# FounderBox Release Checklist

## Before Release

- Run `pnpm check:all`.
- Confirm all migrations apply to an empty Postgres database.
- Confirm `.env.example` matches Vercel, Railway, Neon, R2, Resend, Lemon Squeezy, Sentry, Better Stack, and PostHog.
- Confirm `FOUNDERBOX_ADMIN_EMAIL` is set and `pnpm db:seed` has been run.
- Confirm `/api/health` and MCP `/health` return ok.
- Confirm Lemon Squeezy webhook signing secret is configured.
- Confirm Cloudflare R2 upload and download signed URLs work.
- Confirm Google and GitHub OAuth callback URLs match production domains.

## Deployment

- Deploy web to Vercel from `apps/web`.
- Deploy MCP to Railway from `apps/mcp`.
- Run `pnpm db:deploy` against Neon production.
- Configure Railway scheduled job to call `/api/jobs/artifact-cleanup` with `x-founderbox-cron-secret`.

## Rollback

- Roll back Vercel deployment.
- Roll back Railway deployment.
- Do not roll back database migrations unless a tested down-migration exists.
- Disable Lemon Squeezy webhook temporarily if billing events are failing repeatedly.

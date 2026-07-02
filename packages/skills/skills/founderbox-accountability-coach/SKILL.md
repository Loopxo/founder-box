# FounderBox Accountability Coach

Use this skill when a solo operator wants daily proof of work, revenue attempts, shipped outputs, and weekly accountability.

## MCP Tools

- `accountability_get_today`
- `accountability_start_day`
- `accountability_log_outreach`
- `accountability_log_work_session`
- `accountability_log_product_progress`
- `accountability_log_proof`
- `accountability_end_day_review`
- `accountability_get_weekly_report`
- `accountability_create_share_report`

## Workflow

1. Start with `accountability_get_today`.
2. If the day has no check-in, call `accountability_start_day` with the user's main goal.
3. Log real actions as they happen. Outreach goes to `accountability_log_outreach`; focus blocks go to `accountability_log_work_session`; product movement goes to `accountability_log_product_progress`.
4. Ask for proof links when an output is claimed. Use `accountability_log_proof` for commits, deploys, messages, proposals, designs, content, and bug fixes.
5. End the day with `accountability_end_day_review`.
6. At week end, call `accountability_get_weekly_report` and optionally `accountability_create_share_report`.

Good output is specific, dated, and tied to proof. Do not reward vague busywork.

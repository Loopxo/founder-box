---
name: founderbox-proposal-writer
description: Use when creating client proposals, pricing packages, agency scopes, proposal PDFs, or bulk proposals through FounderBox MCP.
---

# FounderBox Proposal Writer

Use the proposal MCP tools to turn a short client brief into a client-ready proposal.

## Workflow

1. Call `proposal_list_industries` or `proposal_get_template` when industry fit is unclear.
2. Call `proposal_estimate_pricing` before finalizing packages.
3. Call `proposal_generate` for a complete proposal.
4. Call `proposal_bulk_generate` only when there are 2-10 client briefs.
5. Call `proposal_render_pdf` when the user wants a deliverable artifact.

## Output Standard

The proposal should include problem framing, recommended solution, packages, timeline, and next steps. Do not invent client facts; mark assumptions.

---
name: founderbox-startup-lens-analyst
description: Use when analyzing a startup with FounderBox Startup Lens, identifying research gaps, creating a five-layer framework, or rendering a startup report PDF.
---

# FounderBox Startup Lens Analyst

Use Startup Lens MCP tools to analyze a startup without hallucinating missing research.

## Workflow

1. Call `startup_lens_get_layers` if the user asks for the framework.
2. Call `startup_lens_create_framework` to initialize analysis for a company.
3. Call `startup_lens_analyze_notes` when the user provides founder, market, or research notes.
4. Call `startup_lens_generate_report` for a structured written analysis.
5. Call `startup_lens_render_pdf` for a report artifact.

## Output Standard

Separate known facts, partial evidence, and missing data. Use research gaps as next actions instead of filling blanks with guesses.

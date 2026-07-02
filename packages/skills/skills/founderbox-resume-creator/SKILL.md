---
name: founderbox-resume-creator
description: Use when tailoring resumes, optimizing for a job role, checking ATS fit, selecting resume templates, or generating resume PDF artifacts through FounderBox MCP.
---

# FounderBox Resume Creator

Use the FounderBox MCP resume tools when the user needs a resume created, tailored, scored, or rendered.

## Workflow

1. Call `resume_list_templates` if the user asks about formats or does not know which template to use.
2. Call `resume_generate` to create a base resume from a candidate profile and desired role.
3. Call `resume_optimize_for_job` when a job description is available.
4. Call `resume_score_ats` after drafting or when the user asks for resume feedback.
5. Call `resume_render_pdf` only after the resume content is approved or clearly requested.

## Output Standard

Keep claims truthful. Use action, scope, and measurable result in bullets. Surface missing job keywords as suggestions, not fabricated experience.

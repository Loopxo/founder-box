export const RESUME_TEMPLATES = [
  { id: "classic", name: "Classic", description: "ATS-safe serif resume for traditional roles." },
  { id: "modern", name: "Modern", description: "Clean technical resume with stronger section hierarchy." },
  { id: "executive", name: "Executive", description: "Leadership-focused resume for senior operators." },
  { id: "startup", name: "Startup", description: "Lean founder/operator resume for product and startup roles." },
]

export interface ResumeProfile {
  name: string
  title?: string
  email?: string
  phone?: string
  location?: string
  summary?: string
  experience?: string[]
  skills?: string[]
  projects?: string[]
  education?: string[]
}

export interface ResumeGenerateInput {
  profile: ResumeProfile
  desiredRole: string
  seniority?: string
  tone?: "concise" | "executive" | "technical" | "founder"
}

export interface ResumeDraft {
  headline: string
  summary: string
  skills: string[]
  experienceBullets: string[]
  projectBullets: string[]
  markdown: string
}

function splitKeywords(text: string) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+#.\s-]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 3 && !["with", "from", "that", "this", "will", "your", "have", "been"].includes(word)),
    ),
  )
}

export function generateResumeDraft(input: ResumeGenerateInput): ResumeDraft {
  const profile = input.profile
  const role = input.desiredRole.trim()
  const tone = input.tone || "concise"
  const skills = profile.skills?.length ? profile.skills : ["Product thinking", "Execution", "Communication", "Customer discovery"]
  const experienceBullets = (profile.experience?.length ? profile.experience : ["Built and shipped founder-led projects from idea to launch."]).map((item) =>
    item.trim().startsWith("-") ? item.trim().slice(1).trim() : item.trim(),
  )
  const projectBullets = (profile.projects || []).map((item) => item.trim())
  const summary =
    profile.summary ||
    `${profile.name} is a ${profile.title || "builder"} targeting ${role} roles, with a practical record of turning ambiguous problems into shipped outcomes.`
  const headline = `${profile.name} - ${role}${input.seniority ? ` (${input.seniority})` : ""}`
  const toneLine = tone === "executive" ? "Leadership, judgment, and measurable business outcomes are emphasized." : "Impact, clarity, and ATS-readable phrasing are emphasized."
  const markdown = [
    `# ${headline}`,
    "",
    `## Summary`,
    `${summary} ${toneLine}`,
    "",
    "## Skills",
    skills.map((skill) => `- ${skill}`).join("\n"),
    "",
    "## Experience",
    experienceBullets.map((bullet) => `- ${bullet}`).join("\n"),
    projectBullets.length ? "\n## Projects" : "",
    projectBullets.map((bullet) => `- ${bullet}`).join("\n"),
  ]
    .filter(Boolean)
    .join("\n")

  return { headline, summary: `${summary} ${toneLine}`, skills, experienceBullets, projectBullets, markdown }
}

export function optimizeResumeForJob(input: ResumeGenerateInput & { jobDescription: string }) {
  const draft = generateResumeDraft(input)
  const keywords = splitKeywords(input.jobDescription).slice(0, 25)
  const current = `${draft.markdown} ${draft.skills.join(" ")}`.toLowerCase()
  const missingKeywords = keywords.filter((keyword) => !current.includes(keyword)).slice(0, 12)
  const recommendedSkills = Array.from(new Set([...draft.skills, ...missingKeywords.slice(0, 8).map((word) => word.replace(/^\w/, (c) => c.toUpperCase()))]))
  return {
    ...draft,
    targetKeywords: keywords,
    missingKeywords,
    recommendedSkills,
    rewriteNotes: [
      "Mirror high-value nouns from the job description where truthful.",
      "Keep bullet structure action + scope + measurable result.",
      "Avoid graphics, columns, and vague founder storytelling for ATS output.",
    ],
  }
}

export function scoreResumeAts(input: { resumeText: string; jobDescription?: string }) {
  const resume = input.resumeText.toLowerCase()
  const jobKeywords = input.jobDescription ? splitKeywords(input.jobDescription) : []
  const matched = jobKeywords.filter((keyword) => resume.includes(keyword))
  const keywordScore = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 50) : 35
  const structureScore = ["summary", "experience", "skills"].filter((section) => resume.includes(section)).length * 10
  const contactScore = /@/.test(resume) ? 10 : 0
  const score = Math.min(100, keywordScore + structureScore + contactScore)
  const issues = [
    !/@/.test(resume) ? "Missing email/contact signal." : "",
    !resume.includes("experience") ? "Missing explicit Experience section." : "",
    !resume.includes("skills") ? "Missing explicit Skills section." : "",
    jobKeywords.length && matched.length < Math.ceil(jobKeywords.length * 0.35) ? "Low job keyword overlap." : "",
  ].filter(Boolean)
  return { score, matchedKeywords: matched.slice(0, 20), missingKeywords: jobKeywords.filter((keyword) => !matched.includes(keyword)).slice(0, 15), issues }
}


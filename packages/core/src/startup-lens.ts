export interface StartupLensLayerDefinition {
  id: number
  title: string
  purpose: string
  questions: string[]
}

export interface StartupLensInput {
  companyName: string
  country?: string
  sector?: string
  stage?: string
  founderNotes?: string
  marketNotes?: string
  rawResearch?: string
}

export interface StartupLensFramework {
  companyName: string
  country: string
  sector: string
  stage: string
  layers: Array<StartupLensLayerDefinition & { answer: string; confidence: "known" | "partial" | "missing" }>
}

export const STARTUP_LENS_LAYERS: StartupLensLayerDefinition[] = [
  {
    id: 1,
    title: "Origin & Founder DNA",
    purpose: "Explain why this founder was unusually suited or driven to build this company.",
    questions: ["What founder history made the company likely?", "What unfair insight existed at the start?", "What founding constraint shaped the first product?"],
  },
  {
    id: 2,
    title: "Problem Anatomy",
    purpose: "Separate urgent pain from nice-to-have positioning.",
    questions: ["Who suffers most from the problem?", "What workaround existed before?", "What unlock made the problem solvable now?"],
  },
  {
    id: 3,
    title: "Business Model & Moat",
    purpose: "Show how the company captures value and what makes it defensible.",
    questions: ["Who pays, who uses, and who decides?", "What unit economics must be true?", "What advantage compounds over time?"],
  },
  {
    id: 4,
    title: "Scaling Decisions & Inflection Points",
    purpose: "Identify the choices that changed trajectory.",
    questions: ["What broke at each stage?", "Which hires or capital decisions mattered?", "Which pivots changed the business?"],
  },
  {
    id: 5,
    title: "Market & Ecosystem Context",
    purpose: "Ground the startup in country, timing, competition, and regulation.",
    questions: ["What market wave is it riding?", "What is country-specific?", "How are incumbents and substitutes positioned?"],
  },
]

function inferConfidence(answer: string): "known" | "partial" | "missing" {
  if (!answer.trim()) return "missing"
  if (answer.length < 120 || /unknown|unclear|not sure|needs research/i.test(answer)) return "partial"
  return "known"
}

export function getStartupLensLayers() {
  return STARTUP_LENS_LAYERS
}

export function createStartupLensFramework(input: StartupLensInput): StartupLensFramework {
  return {
    companyName: input.companyName,
    country: input.country || "Unknown",
    sector: input.sector || "Unknown",
    stage: input.stage || "Unknown",
    layers: STARTUP_LENS_LAYERS.map((layer) => ({ ...layer, answer: "", confidence: "missing" })),
  }
}

export function analyzeStartupNotes(input: StartupLensInput): StartupLensFramework & { researchGaps: string[] } {
  const notes = [input.founderNotes, input.marketNotes, input.rawResearch].filter(Boolean).join("\n\n")
  const framework = createStartupLensFramework(input)
  const splitNotes = notes
    .split(/\n{2,}|(?<=\.)\s+/)
    .map((note) => note.trim())
    .filter(Boolean)

  const layers = framework.layers.map((layer) => {
    const keywords = [layer.title, layer.purpose, ...layer.questions].join(" ").toLowerCase().split(/\W+/)
    const matches = splitNotes.filter((note) => {
      const lower = note.toLowerCase()
      return keywords.some((keyword) => keyword.length > 5 && lower.includes(keyword))
    })
    const answer = matches.slice(0, 4).join(" ")
    return { ...layer, answer, confidence: inferConfidence(answer) }
  })

  const researchGaps = layers
    .filter((layer) => layer.confidence !== "known")
    .flatMap((layer) => layer.questions.map((question) => `${layer.title}: ${question}`))

  return { ...framework, layers, researchGaps }
}

export function generateStartupLensReport(input: StartupLensInput) {
  const analysis = analyzeStartupNotes(input)
  const summary = `${analysis.companyName} is analyzed as a ${analysis.stage} ${analysis.sector} company in ${analysis.country}. Known evidence is separated from gaps so the agent does not invent missing facts.`
  const markdown = [
    `# Startup Lens: ${analysis.companyName}`,
    "",
    `**Country:** ${analysis.country}`,
    `**Sector:** ${analysis.sector}`,
    `**Stage:** ${analysis.stage}`,
    "",
    "## Summary",
    summary,
    "",
    "## Layer Analysis",
    analysis.layers
      .map((layer) => `### ${layer.id}. ${layer.title}\nConfidence: ${layer.confidence}\n\n${layer.answer || "Missing. More research needed before drawing conclusions."}`)
      .join("\n\n"),
    "",
    "## Research Gaps",
    analysis.researchGaps.length ? analysis.researchGaps.map((gap) => `- ${gap}`).join("\n") : "- No major gaps detected from supplied notes.",
  ].join("\n")

  return { summary, framework: analysis, markdown }
}

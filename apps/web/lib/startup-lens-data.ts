export const STARTUP_LENS_STATUS_OPTIONS = ["Active", "Acquired", "Dead", "IPO"] as const

export type StartupLensStatus = (typeof STARTUP_LENS_STATUS_OPTIONS)[number]

export interface StartupLensCluster {
  title: string
  questions: string[]
}

export interface StartupLensLayer {
  id: number
  title: string
  synthesisPrompt: string
  clusters: StartupLensCluster[]
}

export interface StartupLensDraft {
  companyName: string
  metaCountry: string
  metaSector: string
  metaFounded: string
  metaStage: string
  metaStatus: StartupLensStatus | ""
  answers: Record<string, string>
  syntheses: Record<string, string>
}

export const STARTUP_LENS_LAYERS: StartupLensLayer[] = [
  {
    id: 1,
    title: "Origin & Founder DNA",
    synthesisPrompt:
      "What is the single most important thing the founding context explains about this company that you couldn't understand otherwise?",
    clusters: [
      {
        title: "Founder's wound",
        questions: [
          "Why did THIS specific person start THIS specific company — not just 'they saw a problem' but what personal history made it inevitable?",
          "Was this an insider who got frustrated, an outsider who saw a gap, or an immigrant who noticed something that locals had normalised?",
          "What would have happened to this founder if the company had never worked — did they have a plan B, or was this the only path?",
          "Is there a personal wound or injustice in the origin story that the founder rarely talks about in press interviews?",
        ],
      },
      {
        title: "Unfair insight",
        questions: [
          "What did the founder know or believe at founding that most people in the industry would have disagreed with?",
          "Was the insight based on a unique data point, a proprietary relationship, lived experience, or technical knowledge unavailable to outsiders?",
          "How long before founding did the founder first identify this insight — was it years in development or a sudden realisation?",
        ],
      },
      {
        title: "Co-founder dynamics",
        questions: [
          "Solo founder or co-founders — and if co-founders, how did they meet and why did they start this together?",
          "What does the co-founder composition (technical/business/domain) signal about what the company believed would be hard?",
          "Have there been co-founder exits — and if so, what does the reason and timing reveal about internal stress?",
        ],
      },
      {
        title: "Founding context",
        questions: [
          "What infrastructure (payment rails, cloud, regulatory environment, device penetration) existed at founding that made this possible?",
          "What would have been impossible to build three years earlier — what changed in the environment that created the window?",
          "Was this company born in a boom or a bust — and how did that shape the founding assumptions about capital and growth?",
        ],
      },
      {
        title: "First customer",
        questions: [
          "Who was the very first paying customer, and how did the founder get them?",
          "Was the first customer representative of the eventual target market, or was it an opportunistic sale to someone different?",
          "What did the founder have to promise or compromise to close that first customer — and did those compromises persist?",
        ],
      },
      {
        title: "Origin mythology",
        questions: [
          "What is the official founding story the company tells — and what is conspicuously absent from it?",
          "What does the name, brand, or first product communicate about what the founders believed they were building?",
          "Has the origin story been revised over time — and what does that revision reveal about what the company now values?",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Problem Anatomy",
    synthesisPrompt:
      "What single unlock made this business possible — and is that unlock durable or fragile?",
    clusters: [
      {
        title: "Problem severity",
        questions: [
          "Is this a hair-on-fire problem (people are already trying hard to solve it) or a vitamin (nice to have but not urgent)?",
          "Who is suffering most acutely — and is that the same person who will pay to solve it?",
          "How long has this problem existed — is it ancient infrastructure, a new behaviour, or a regulatory creation?",
        ],
      },
      {
        title: "Workaround economy",
        questions: [
          "What did people do before this company existed — and what did that workaround cost them in time, money, or dignity?",
          "Who was profiting from the problem existing? Which incumbents had a vested interest in the problem not being solved?",
          "How did those incumbents respond when this startup appeared — did they fight, copy, partner, or ignore?",
        ],
      },
      {
        title: "Problem boundaries",
        questions: [
          "Who does NOT have this problem — and why? What does that boundary reveal about the addressable market?",
          "Is the problem local and cultural, or universal but expressed differently by geography?",
          "What does the problem look like in a more developed market — is this an emerging market version of a solved problem?",
        ],
      },
      {
        title: "The unlock",
        questions: [
          "What infrastructure, behaviour change, or regulatory shift made this problem now solvable when it wasn't before?",
          "Is the unlock available in other markets — or is it specific to this country's trust infrastructure, payment rails, or regulation?",
          "What happens to this company if the unlock disappears — e.g. regulation reverses, or a large platform builds it natively?",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Business Model & Moat",
    synthesisPrompt:
      "At what point in the company's history did the business model become the ACTUAL business model — and what changed?",
    clusters: [
      {
        title: "Revenue architecture",
        questions: [
          "Who pays, who uses, and who decides — are these the same person? If not, which gap does this create?",
          "Is revenue transactional (one-time), recurring (subscription), or usage-based — and why did the founder make that choice?",
          "What percentage of revenue comes from the top 3 customers? What happens if one churns?",
          "Does the pricing model align with the unit of value the customer actually experiences, or is there a mismatch?",
          "Could the pricing model change without changing the product — and would that unlock a different market?",
        ],
      },
      {
        title: "Unit economics",
        questions: [
          "What is the true CAC, including all indirect costs (sales time, free trials, integrations, onboarding)?",
          "What is the LTV assumption, and what churn rate is it based on — is that churn rate empirical or hoped for?",
          "At what scale does the unit become profitable — and has the company actually reached that scale yet?",
          "Does CAC go up or down as the company grows — market saturation vs. brand compounding?",
          "Is there a hidden subsidy propping up unit economics (VC cash, loss-leader pricing, below-market talent)?",
        ],
      },
      {
        title: "Moat & defensibility",
        questions: [
          "If a well-funded competitor copied this product exactly today, what would they lack that the company already has?",
          "Is the moat structural (network effects, switching costs, data) or positional (brand, distribution, timing)?",
          "Does the moat compound over time, or does it erode as the market matures?",
          "What is the switching cost for a customer who wants to leave — in time, money, and effort?",
          "Has the moat been tested? Has a well-resourced competitor tried and failed to take market share — and why?",
        ],
      },
      {
        title: "Cost structure",
        questions: [
          "What is the ratio of fixed to variable costs — and does the model have operating leverage as revenue grows?",
          "Which costs are invisible in the early stage but become dominant at scale (compliance, infrastructure, support)?",
          "What external factor (regulation, energy price, labour cost) could break the cost structure entirely?",
        ],
      },
      {
        title: "Growth & distribution",
        questions: [
          "What is the primary acquisition channel — and is it owned, rented, or borrowed?",
          "Is there a viral or referral loop built into the product, or is every customer acquired from scratch?",
          "Which channels worked in the early stage that will stop working at scale — and what replaces them?",
          "Is growth driven by the product, the sales team, or the brand — and can any of these be decoupled?",
        ],
      },
      {
        title: "Geography & portability",
        questions: [
          "Which parts of the business model are universal, and which are specific to this country's trust, payment, or regulatory infrastructure?",
          "If this model was transplanted to a different country, what single assumption would fail first?",
          "Did the company build on top of existing infrastructure or did it have to build its own rails?",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Scaling Decisions & Inflection Points",
    synthesisPrompt:
      "What is the single decision the company made — good or bad — that most determined its current trajectory?",
    clusters: [
      {
        title: "Revenue milestones",
        questions: [
          "What changed at the first $1K, $1M, and $10M in revenue — product, team, channel, or customer type?",
          "Was each revenue milestone reached by doing more of the same, or by a fundamentally different motion?",
          "What broke at each order-of-magnitude increase — what was the company's recurring failure mode at scale?",
        ],
      },
      {
        title: "Near-death moments",
        questions: [
          "When did the company nearly die — what was the specific threat and what saved it?",
          "Were the near-death moments external (market, regulation) or internal (team, product, cash)?",
          "What decisions made in a near-death moment became permanent parts of the company's DNA?",
        ],
      },
      {
        title: "People & key hires",
        questions: [
          "Who was in the room when the company first worked — and are they still there?",
          "What was the single most consequential hire, and what did they change?",
          "What key departures hurt the company — and what does the reason reveal about culture?",
        ],
      },
      {
        title: "Capital decisions",
        questions: [
          "Did the company raise venture capital or stay lean — and what did that choice force in terms of growth pressure?",
          "If VC-backed, who led the key rounds — and what strategic value or constraints did those investors bring?",
          "Was there a moment where the company could have raised but chose not to — or vice versa — and what did that signal?",
        ],
      },
      {
        title: "Strategic pivots",
        questions: [
          "Did the company pivot — and if so, from what to what, and why at that specific moment?",
          "What did the company kill that once looked promising — and was the decision right in retrospect?",
          "What is the company doing now that it explicitly said it would never do at founding?",
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Market & Ecosystem Context",
    synthesisPrompt:
      "What is the single market context factor that most explains why this company exists in this country at this time — and not somewhere else?",
    clusters: [
      {
        title: "The wave",
        questions: [
          "What macro wave was the company riding — regulatory change, infrastructure buildout, behaviour shift, or demographic change?",
          "Was the company ahead of the wave (too early), on the wave (perfect timing), or catching the wave (late but still viable)?",
          "Is the wave still building, peaking, or subsiding — and what does that mean for the company's next 5 years?",
        ],
      },
      {
        title: "Country-specific context",
        questions: [
          "What trust infrastructure was available to this founder that their counterpart in another country wouldn't have had?",
          "What did success in THIS market require that success in the US, UK, or China wouldn't require?",
          "What regulatory tailwind or headwind was specific to this country — and is that changing?",
        ],
      },
      {
        title: "Competitive ecosystem",
        questions: [
          "Who are the most dangerous competitors — and are they well-funded copycats, entrenched incumbents, or cross-sector attackers?",
          "Has the company partnered with potential competitors — and what does that signal about its confidence in its moat?",
          "What would a large platform (Google, Meta, a local telco, a major bank) have to give up to compete directly — and will they?",
        ],
      },
      {
        title: "Cross-geography lens",
        questions: [
          "What analogue company in another market does this most resemble — and where has that analogue succeeded or failed?",
          "What local context would make an investor from another country consistently misunderstand this company?",
          "If you had to pick the one country whose market conditions most favoured this model, which would it be and why?",
        ],
      },
    ],
  },
]

export const STARTUP_LENS_TOTAL_QUESTIONS = STARTUP_LENS_LAYERS.reduce(
  (total, layer) =>
    total + layer.clusters.reduce((layerTotal, cluster) => layerTotal + cluster.questions.length, 0),
  0,
)

export function getStartupLensQuestionId(layerId: number, clusterIndex: number, questionIndex: number) {
  return `layer-${layerId}-cluster-${clusterIndex}-question-${questionIndex}`
}

export function createEmptyStartupLensDraft(): StartupLensDraft {
  return {
    companyName: "",
    metaCountry: "",
    metaSector: "",
    metaFounded: "",
    metaStage: "",
    metaStatus: "",
    answers: {},
    syntheses: {},
  }
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function readStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  )
}

export function normalizeStartupLensDraft(value: unknown): StartupLensDraft {
  const emptyDraft = createEmptyStartupLensDraft()

  if (!value || typeof value !== "object") {
    return emptyDraft
  }

  const record = value as Record<string, unknown>
  const metaStatus = readString(record.metaStatus)

  return {
    companyName: readString(record.companyName),
    metaCountry: readString(record.metaCountry),
    metaSector: readString(record.metaSector),
    metaFounded: readString(record.metaFounded),
    metaStage: readString(record.metaStage),
    metaStatus: STARTUP_LENS_STATUS_OPTIONS.includes(metaStatus as StartupLensStatus)
      ? (metaStatus as StartupLensStatus)
      : "",
    answers: readStringRecord(record.answers),
    syntheses: readStringRecord(record.syntheses),
  }
}

import puppeteer from "puppeteer-core"
import chromium from "@sparticuz/chromium"
import {
  getStartupLensQuestionId,
  normalizeStartupLensDraft,
  STARTUP_LENS_LAYERS,
  STARTUP_LENS_TOTAL_QUESTIONS,
  type StartupLensDraft,
} from "@/lib/startup-lens-data"

const PDF_LAYER_STYLES = {
  1: { accent: "#7C6AF7", soft: "rgba(124,106,247,0.12)", border: "rgba(124,106,247,0.4)" },
  2: { accent: "#C0562A", soft: "rgba(192,86,42,0.12)", border: "rgba(192,86,42,0.4)" },
  3: { accent: "#1F6E56", soft: "rgba(31,110,86,0.12)", border: "rgba(31,110,86,0.4)" },
  4: { accent: "#B07314", soft: "rgba(176,115,20,0.12)", border: "rgba(176,115,20,0.4)" },
  5: { accent: "#185FA5", soft: "rgba(24,95,165,0.12)", border: "rgba(24,95,165,0.4)" },
} as const

async function getBrowserConfig() {
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1"

  if (isProduction) {
    return {
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    }
  }

  return {
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function formatMultiline(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />")
}

function getCompletedQuestionCount(draft: StartupLensDraft) {
  return Object.values(draft.answers).filter((value) => value.trim().length > 0).length
}

function getLayerCompletedQuestionCount(layerId: number, draft: StartupLensDraft) {
  const layer = STARTUP_LENS_LAYERS.find((item) => item.id === layerId)

  if (!layer) {
    return 0
  }

  return layer.clusters.reduce((total, cluster, clusterIndex) => {
    const clusterCompleted = cluster.questions.filter((_, questionIndex) => {
      const questionId = getStartupLensQuestionId(layerId, clusterIndex, questionIndex)
      return draft.answers[questionId]?.trim().length
    }).length

    return total + clusterCompleted
  }, 0)
}

function getLayerQuestionCount(layerId: number) {
  const layer = STARTUP_LENS_LAYERS.find((item) => item.id === layerId)
  if (!layer) {
    return 0
  }

  return layer.clusters.reduce((total, cluster) => total + cluster.questions.length, 0)
}

function renderQuestionBlock(question: string, answer: string) {
  const hasAnswer = answer.trim().length > 0

  return `
    <div class="question-block">
      <div class="question-text">${escapeHtml(question)}</div>
      <div class="answer-box ${hasAnswer ? "answered" : "empty"}">
        ${hasAnswer ? formatMultiline(answer) : "<span class='empty-answer'>Not answered</span>"}
      </div>
    </div>
  `
}

function generateStartupLensHTML(draft: StartupLensDraft) {
  const companyName = draft.companyName.trim() || "Startup"
  const completedQuestions = getCompletedQuestionCount(draft)
  const progressPercent = STARTUP_LENS_TOTAL_QUESTIONS
    ? Math.round((completedQuestions / STARTUP_LENS_TOTAL_QUESTIONS) * 100)
    : 0
  const generatedOn = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const metaEntries = [
    ["Country", draft.metaCountry],
    ["Sector", draft.metaSector],
    ["Founded", draft.metaFounded],
    ["Stage", draft.metaStage],
    ["Status", draft.metaStatus],
  ].filter((entry) => entry[1].trim().length > 0)

  const metaMarkup =
    metaEntries.length > 0
      ? metaEntries
          .map(
            ([label, value]) => `
              <div class="meta-card">
                <span class="meta-label">${escapeHtml(label)}</span>
                <span class="meta-value">${escapeHtml(value)}</span>
              </div>
            `,
          )
          .join("")
      : `
        <div class="meta-card">
          <span class="meta-label">Status</span>
          <span class="meta-value">No company metadata added yet</span>
        </div>
      `

  const layersMarkup = STARTUP_LENS_LAYERS.map((layer) => {
    const layerStyle = PDF_LAYER_STYLES[layer.id as keyof typeof PDF_LAYER_STYLES]
    const layerCompleted = getLayerCompletedQuestionCount(layer.id, draft)
    const layerTotal = getLayerQuestionCount(layer.id)

    const clusterMarkup = layer.clusters
      .map((cluster, clusterIndex) => {
        const questionsMarkup = cluster.questions
          .map((question, questionIndex) => {
            const questionId = getStartupLensQuestionId(layer.id, clusterIndex, questionIndex)
            return renderQuestionBlock(question, draft.answers[questionId] || "")
          })
          .join("")

        return `
          <section class="cluster">
            <div class="cluster-title">${escapeHtml(cluster.title)}</div>
            ${questionsMarkup}
          </section>
        `
      })
      .join("")

    const synthesis = draft.syntheses[String(layer.id)] || ""

    return `
      <article class="layer-page" style="--layer-accent:${layerStyle.accent};--layer-soft:${layerStyle.soft};--layer-border:${layerStyle.border};">
        <div class="layer-shell">
          <div class="layer-header">
            <div>
              <div class="layer-kicker">Layer ${String(layer.id).padStart(2, "0")}</div>
              <h2>${escapeHtml(layer.title)}</h2>
            </div>
            <div class="layer-progress">${layerCompleted} / ${layerTotal}</div>
          </div>

          ${clusterMarkup}

          <section class="synthesis-block">
            <div class="synthesis-title">Layer synthesis</div>
            <div class="synthesis-text">
              ${
                synthesis.trim().length > 0
                  ? formatMultiline(synthesis)
                  : `<span class="empty-answer">${escapeHtml(layer.synthesisPrompt)}</span>`
              }
            </div>
          </section>
        </div>
      </article>
    `
  }).join("")

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${escapeHtml(companyName)} Startup Lens Report</title>
        <style>
          @page {
            size: A4;
            margin: 14mm;
          }

          :root {
            color-scheme: dark;
            --bg: #111118;
            --surface: #18181f;
            --surface-2: #1e1e28;
            --border: #2a2a38;
            --border-warm: #3a3830;
            --text: #ede9dc;
            --muted: #9e9880;
            --gold: #d4a853;
            --gold-soft: rgba(212, 168, 83, 0.12);
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            line-height: 1.55;
          }

          .cover {
            min-height: calc(100vh - 28mm);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background:
              radial-gradient(circle at top left, rgba(212, 168, 83, 0.16), transparent 28%),
              linear-gradient(180deg, rgba(30, 30, 40, 0.98) 0%, rgba(17, 17, 24, 1) 100%);
            border: 1px solid var(--border);
            border-radius: 24px;
            overflow: hidden;
          }

          .cover-top {
            padding: 26px 28px 20px;
            border-bottom: 1px solid var(--border);
          }

          .eyebrow {
            font-size: 11px;
            letter-spacing: 0.26em;
            text-transform: uppercase;
            color: var(--gold);
            font-weight: 700;
            margin-bottom: 14px;
          }

          .brand {
            font-family: Georgia, "Times New Roman", serif;
            font-size: 44px;
            letter-spacing: -0.05em;
            margin: 0 0 14px;
          }

          .brand span {
            color: var(--gold);
            font-style: italic;
          }

          .company-name {
            font-family: Georgia, "Times New Roman", serif;
            font-size: 50px;
            line-height: 1.02;
            letter-spacing: -0.05em;
            margin: 0;
          }

          .cover-copy {
            margin-top: 18px;
            max-width: 640px;
            color: var(--muted);
            font-size: 14px;
          }

          .meta-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            padding: 24px 28px 18px;
          }

          .meta-card {
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 14px 16px;
            background: rgba(21, 21, 27, 0.9);
          }

          .meta-label {
            display: block;
            color: var(--muted);
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin-bottom: 8px;
            font-weight: 700;
          }

          .meta-value {
            display: block;
            font-size: 15px;
            font-weight: 600;
          }

          .cover-bottom {
            padding: 0 28px 28px;
          }

          .summary-row {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-bottom: 16px;
          }

          .summary-card {
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 14px 16px;
            background: rgba(24, 24, 31, 0.96);
          }

          .summary-card strong {
            display: block;
            font-size: 24px;
            margin-top: 6px;
          }

          .progress-track {
            height: 10px;
            border-radius: 999px;
            background: var(--surface-2);
            overflow: hidden;
            border: 1px solid var(--border);
          }

          .progress-fill {
            height: 100%;
            width: ${progressPercent}%;
            background: linear-gradient(90deg, #d4a853 0%, #f3d38e 100%);
          }

          .layer-page {
            break-before: page;
          }

          .layer-shell {
            border: 1px solid var(--layer-border);
            border-radius: 24px;
            overflow: hidden;
            background: linear-gradient(180deg, var(--layer-soft) 0%, rgba(24, 24, 31, 0.98) 18%, rgba(17, 17, 24, 1) 100%);
          }

          .layer-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            padding: 22px 24px 18px;
            border-bottom: 1px solid var(--layer-border);
          }

          .layer-kicker {
            color: var(--layer-accent);
            text-transform: uppercase;
            letter-spacing: 0.22em;
            font-size: 10px;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .layer-header h2 {
            margin: 0;
            font-size: 28px;
            letter-spacing: -0.04em;
            line-height: 1.08;
          }

          .layer-progress {
            border: 1px solid var(--layer-border);
            border-radius: 999px;
            padding: 8px 12px;
            white-space: nowrap;
            font-size: 12px;
            background: rgba(21, 21, 27, 0.84);
          }

          .cluster {
            padding: 20px 24px 0;
          }

          .cluster-title {
            font-size: 10px;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 14px;
            font-weight: 700;
          }

          .question-block {
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 16px;
            background: rgba(30, 30, 40, 0.92);
            margin-bottom: 14px;
            break-inside: avoid;
          }

          .question-text {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.7;
            font-style: italic;
            margin-bottom: 12px;
          }

          .answer-box {
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 14px 16px;
            font-size: 13px;
            line-height: 1.75;
            background: rgba(21, 21, 27, 0.9);
          }

          .answer-box.answered {
            border-color: var(--layer-border);
            background: rgba(21, 21, 27, 0.96);
          }

          .empty-answer {
            color: #6e6875;
            font-style: italic;
          }

          .synthesis-block {
            margin: 8px 24px 24px;
            padding: 18px;
            border-radius: 20px;
            border: 1px solid var(--layer-border);
            background: rgba(21, 21, 27, 0.96);
            break-inside: avoid;
          }

          .synthesis-title {
            color: var(--layer-accent);
            text-transform: uppercase;
            letter-spacing: 0.22em;
            font-size: 10px;
            font-weight: 700;
            margin-bottom: 12px;
          }

          .synthesis-text {
            font-size: 14px;
            line-height: 1.8;
          }
        </style>
      </head>
      <body>
        <section class="cover">
          <div>
            <div class="cover-top">
              <div class="eyebrow">FounderBox Research Workspace</div>
              <div class="brand">startup<span>lens</span></div>
              <h1 class="company-name">${escapeHtml(companyName)}</h1>
              <p class="cover-copy">
                A structured company research report covering founder DNA, problem anatomy, business model,
                scaling decisions, and market context.
              </p>
            </div>

            <div class="meta-grid">${metaMarkup}</div>
          </div>

          <div class="cover-bottom">
            <div class="summary-row">
              <div class="summary-card">
                <span class="meta-label">Questions answered</span>
                <strong>${completedQuestions}</strong>
              </div>
              <div class="summary-card">
                <span class="meta-label">Total prompts</span>
                <strong>${STARTUP_LENS_TOTAL_QUESTIONS}</strong>
              </div>
              <div class="summary-card">
                <span class="meta-label">Generated on</span>
                <strong style="font-size:18px">${escapeHtml(generatedOn)}</strong>
              </div>
            </div>

            <div class="meta-label" style="margin-bottom:8px;">Completion progress</div>
            <div class="progress-track">
              <div class="progress-fill"></div>
            </div>
          </div>
        </section>

        ${layersMarkup}
      </body>
    </html>
  `
}

export async function generateStartupLensPDF(value: unknown): Promise<Buffer> {
  const draft = normalizeStartupLensDraft(value)
  const html = generateStartupLensHTML(draft)
  const browserConfig = await getBrowserConfig()
  const browser = await puppeteer.launch(browserConfig)

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: "networkidle0" })
    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
      },
      printBackground: true,
      preferCSSPageSize: true,
    })

    return Buffer.from(pdfBuffer)
  } finally {
    await browser.close()
  }
}

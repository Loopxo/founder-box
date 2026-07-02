"use client"

import { useEffect, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Download,
  Globe,
  Info,
  Lightbulb,
  RotateCcw,
  Search,
  Sparkles,
  Target,
} from "lucide-react"
import {
  createEmptyStartupLensDraft,
  getStartupLensQuestionId,
  normalizeStartupLensDraft,
  STARTUP_LENS_LAYERS,
  STARTUP_LENS_STATUS_OPTIONS,
  STARTUP_LENS_TOTAL_QUESTIONS,
  type StartupLensDraft,
} from "@/lib/startup-lens-data"

const STORAGE_KEY = "founderbox-startup-lens-draft-v1"

const PALETTE = {
  bg: "#111118",
  surface: "#18181F",
  surface2: "#1E1E28",
  surface3: "#15151B",
  border: "#2A2A38",
  borderWarm: "#3A3830",
  text: "#EDE9DC",
  muted: "#9E9880",
  gold: "#D4A853",
  goldSoft: "rgba(212,168,83,0.12)",
  goldGlow: "rgba(212,168,83,0.18)",
  success: "#4D9E6A",
  shadow: "0 28px 80px rgba(0,0,0,0.28)",
} as const

const LAYER_GOLD_STYLE = {
  accent: "#D4A853",
  border: "rgba(212,168,83,0.35)",
  washSoft: "rgba(212,168,83,0.08)",
  washStrong: "linear-gradient(180deg, rgba(212,168,83,0.18) 0%, rgba(24,24,31,0.96) 100%)",
} as const

const LAYER_STYLES = {
  1: LAYER_GOLD_STYLE,
  2: LAYER_GOLD_STYLE,
  3: LAYER_GOLD_STYLE,
  4: LAYER_GOLD_STYLE,
  5: LAYER_GOLD_STYLE,
} as const

const LAYER_ICONS: Record<number, LucideIcon> = {
  1: BookOpen,
  2: Search,
  3: BarChart3,
  4: Target,
  5: Globe,
}

type ToastTone = "success" | "error" | "info"

interface ToastState {
  message: string
  tone: ToastTone
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

function sanitizeFilename(companyName: string) {
  const safeName = companyName.trim().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  return safeName || "startup_lens_report"
}

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] disabled:cursor-not-allowed disabled:opacity-60"

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A853] disabled:cursor-not-allowed disabled:opacity-60"

const baseInputClass =
  "w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-[#EDE9DC] outline-none transition-colors placeholder:text-[#706a57] focus:border-[#D4A853]"

const answerAreaClass =
  "min-h-[110px] w-full rounded-lg border bg-[#15151B] px-4 py-3 text-sm leading-7 text-[#EDE9DC] outline-none transition-colors placeholder:text-[#706a57] focus:border-[#D4A853]"

const synthesisAreaClass =
  "min-h-[120px] w-full rounded-lg border bg-[#14141A] px-4 py-3 text-sm leading-7 text-[#EDE9DC] outline-none transition-colors placeholder:text-[#706a57] focus:border-[#D4A853]"

export default function StartupLensWorkspace() {
  const [draft, setDraft] = useState<StartupLensDraft>(createEmptyStartupLensDraft)
  const [activeLayer, setActiveLayer] = useState(1)
  const [collapsedLayers, setCollapsedLayers] = useState<number[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(STORAGE_KEY)
      if (storedValue) {
        setDraft(normalizeStartupLensDraft(JSON.parse(storedValue)))
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsReady(true)
    }
  }, [])

  useEffect(() => {
    if (!isReady) {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [draft, isReady])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null)
    }, 2800)

    return () => window.clearTimeout(timeoutId)
  }, [toast])

  const completedQuestions = getCompletedQuestionCount(draft)
  const progressPercent = STARTUP_LENS_TOTAL_QUESTIONS
    ? Math.round((completedQuestions / STARTUP_LENS_TOTAL_QUESTIONS) * 100)
    : 0

  const showToast = (message: string, tone: ToastTone = "info") => {
    setToast({ message, tone })
  }

  const updateMetaField = <K extends keyof Omit<StartupLensDraft, "answers" | "syntheses">>(
    field: K,
    value: StartupLensDraft[K],
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateAnswer = (questionId: string, value: string) => {
    setDraft((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [questionId]: value,
      },
    }))
  }

  const updateSynthesis = (layerId: number, value: string) => {
    setDraft((current) => ({
      ...current,
      syntheses: {
        ...current.syntheses,
        [String(layerId)]: value,
      },
    }))
  }

  const toggleLayer = (layerId: number) => {
    setActiveLayer(layerId)
    setCollapsedLayers((current) =>
      current.includes(layerId) ? current.filter((id) => id !== layerId) : [...current, layerId],
    )
  }

  const scrollToLayer = (layerId: number) => {
    setActiveLayer(layerId)
    setCollapsedLayers((current) => current.filter((id) => id !== layerId))

    window.requestAnimationFrame(() => {
      document.getElementById(`startup-lens-layer-${layerId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    })
  }

  const clearAll = () => {
    const confirmed = window.confirm("Clear all Startup Lens notes? This removes the local draft.")

    if (!confirmed) {
      return
    }

    const emptyDraft = createEmptyStartupLensDraft()
    setDraft(emptyDraft)
    window.localStorage.removeItem(STORAGE_KEY)
    showToast("Startup Lens draft cleared.", "success")
  }

  const downloadReport = async () => {
    setIsDownloading(true)

    try {
      const response = await fetch("/api/startup-lens-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.message || payload?.error || "Unable to generate the Startup Lens report.")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${sanitizeFilename(draft.companyName)}_startup_lens_report.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.URL.revokeObjectURL(url)

      showToast("Startup Lens report downloaded.", "success")
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Something went wrong while generating the PDF.", "error")
    } finally {
      setIsDownloading(false)
    }
  }

  const copyAIPrompt = async () => {
    try {
      let prompt = `# Startup Lens Research Report\n\n`
      prompt += `You are an expert startup analyst. Below is my layered research on the startup "${draft.companyName.trim() || 'Unknown'}".\n\n`
      prompt += `Please generate a comprehensive, professional PDF-style research report based on the following structured data.\n\n`
      prompt += `## 1. Company Metadata\n`
      prompt += `- **Country**: ${draft.metaCountry || 'Not provided'}\n`
      prompt += `- **Sector**: ${draft.metaSector || 'Not provided'}\n`
      prompt += `- **Founded**: ${draft.metaFounded || 'Not provided'}\n`
      prompt += `- **Stage**: ${draft.metaStage || 'Not provided'}\n`
      prompt += `- **Status**: ${draft.metaStatus || 'Unknown'}\n\n`

      STARTUP_LENS_LAYERS.forEach(layer => {
        prompt += `## Layer ${layer.id}: ${layer.title}\n\n`
        
        layer.clusters.forEach((cluster, clusterIndex) => {
          prompt += `### ${cluster.title}\n`
          cluster.questions.forEach((question, questionIndex) => {
            const questionId = getStartupLensQuestionId(layer.id, clusterIndex, questionIndex)
            const answer = draft.answers[questionId]
            prompt += `**Question:** ${question}\n`
            prompt += `**Answer:** ${answer && answer.trim().length > 0 ? answer.trim() : "*No answer provided*"}\n\n`
          })
        })
        
        const synthesis = draft.syntheses[String(layer.id)]
        prompt += `**Layer ${layer.id} Conclusion/Synthesis:**\n${synthesis && synthesis.trim().length > 0 ? synthesis.trim() : "*No synthesis provided*"}\n\n---\n\n`
      })

      prompt += `## Instructions for AI\n`
      prompt += `1. Read the framework and the answers supplied above.\n`
      prompt += `2. Structure your output into a formal business report.\n`
      prompt += `3. Where answers are '*No answer provided*', you can either omit the detail or infer intelligently if it adds substantial value without hallucinating facts.\n`
      prompt += `4. Conclude with an overall assessment of the business model and growth viability based on the syntheses.\n`

      await navigator.clipboard.writeText(prompt)
      showToast("AI Prompt copied to clipboard!", "success")
    } catch {
      showToast("Failed to copy prompt.", "error")
    }
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-6">
          <section
            className="overflow-hidden rounded-lg border p-[32px]"
            style={{
              borderColor: PALETTE.border,
              background: `linear-gradient(180deg, ${PALETTE.goldSoft} 0%, rgba(24,24,31,0.94) 35%, ${PALETTE.surface} 100%)`,
            }}
          >
            <div className="border-b pb-6" style={{ borderColor: PALETTE.border }}>
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="max-w-3xl">
                  <p className="studio-label mb-2">
                    Research workspace
                  </p>
                  <h1
                    className="mb-3 text-[clamp(2rem,4vw,3.6rem)] font-extrabold leading-[1.05]"
                    style={{ color: PALETTE.text }}
                  >
                    Startup Lens
                  </h1>
                  <p className="mb-[10px] max-w-[58rem] text-[1.05rem] leading-[1.7]" style={{ color: PALETTE.text }}>
                    Break a startup into founder history, problem shape, business model, scaling choices, and
                    market context. This draft autosaves in your browser and exports as a clean PDF report.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={clearAll}
                    className={secondaryButtonClass}
                    style={{
                      borderColor: PALETTE.borderWarm,
                      color: PALETTE.text,
                      background: "rgba(24,24,31,0.88)",
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear Draft
                  </button>
                  <button
                    type="button"
                    onClick={downloadReport}
                    disabled={isDownloading}
                    className={primaryButtonClass}
                    style={{
                      background: PALETTE.gold,
                      color: PALETTE.bg,
                      boxShadow: `0 10px 30px ${PALETTE.goldGlow}`,
                    }}
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading ? "Generating PDF..." : "Download PDF"}
                  </button>

                  <div className="ml-1 flex items-center gap-2 border-l pl-4" style={{ borderColor: PALETTE.border }}>
                    <button
                      type="button"
                      onClick={copyAIPrompt}
                      className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-transform focus-visible:outline-none focus-visible:ring-2 hover:-translate-y-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #1E1E28 0%, #15151B 100%)',
                        color: PALETTE.gold,
                        border: `1px solid ${PALETTE.borderWarm}`,
                        boxShadow: `0 4px 14px rgba(212,168,83,0.08)`,
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                      Copy AI Prompt
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast("Paste this prompt into ChatGPT or Claude to auto-generate a full report based on your notes.", "info")}
                      className="rounded-full flex h-8 w-8 items-center justify-center hover:bg-white/10 transition-colors bg-[#1E1E28] border cursor-help"
                      title="What is this?"
                      style={{ borderColor: PALETTE.border, color: PALETTE.muted }}
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="studio-label mb-2">
                  Company under research
                </p>
                <input
                  value={draft.companyName}
                  onChange={(event) => updateMetaField("companyName", event.target.value)}
                  placeholder="Company name"
                  className="w-full border-b bg-transparent pb-4 text-[2rem] font-bold tracking-tight text-[#EDE9DC] outline-none placeholder:text-[#4E4B43] transition-colors focus:border-[#D4A853] sm:text-[3.15rem]"
                  style={{
                    borderColor: PALETTE.borderWarm,
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 pt-6 sm:grid-cols-2 xl:grid-cols-5">
              <label className="block">
                <span className="studio-label mb-2 block">
                  Country
                </span>
                <input
                  value={draft.metaCountry}
                  onChange={(event) => updateMetaField("metaCountry", event.target.value)}
                  placeholder="e.g. India"
                  className={baseInputClass}
                  style={{ borderColor: PALETTE.border, background: PALETTE.surface3 }}
                />
              </label>

              <label className="block">
                <span className="studio-label mb-2 block">
                  Sector
                </span>
                <input
                  value={draft.metaSector}
                  onChange={(event) => updateMetaField("metaSector", event.target.value)}
                  placeholder="e.g. Fintech"
                  className={baseInputClass}
                  style={{ borderColor: PALETTE.border, background: PALETTE.surface3 }}
                />
              </label>

              <label className="block">
                <span className="studio-label mb-2 block">
                  Founded
                </span>
                <input
                  value={draft.metaFounded}
                  onChange={(event) => updateMetaField("metaFounded", event.target.value)}
                  placeholder="e.g. 2016"
                  className={baseInputClass}
                  style={{ borderColor: PALETTE.border, background: PALETTE.surface3 }}
                />
              </label>

              <label className="block">
                <span className="studio-label mb-2 block">
                  Stage
                </span>
                <input
                  value={draft.metaStage}
                  onChange={(event) => updateMetaField("metaStage", event.target.value)}
                  placeholder="e.g. Series B"
                  className={baseInputClass}
                  style={{ borderColor: PALETTE.border, background: PALETTE.surface3 }}
                />
              </label>

              <label className="block">
                <span className="studio-label mb-2 block">
                  Status
                </span>
                <select
                  value={draft.metaStatus}
                  onChange={(event) => updateMetaField("metaStatus", event.target.value as StartupLensDraft["metaStatus"])}
                  className={baseInputClass}
                  style={{ borderColor: PALETTE.border, background: PALETTE.surface3 }}
                >
                  <option value="">Unknown</option>
                  {STARTUP_LENS_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="border-t pt-6 mt-6" style={{ borderColor: PALETTE.border }}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span style={{ color: PALETTE.text }}>
                  {completedQuestions} of {STARTUP_LENS_TOTAL_QUESTIONS} research questions answered
                </span>
                <span style={{ color: PALETTE.gold }}>{progressPercent}% complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: PALETTE.surface3 }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #D4A853 0%, #F3D38E 100%)",
                  }}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="studio-label mb-1">
                Layered research grid
              </p>
              <h2 className="text-xl font-bold" style={{ color: PALETTE.text }}>
                Fill each layer, then write the synthesis that actually matters
              </h2>
            </div>
            <div className="hidden rounded-full border px-4 py-2 text-xs font-medium xl:block" style={{ borderColor: PALETTE.border, color: PALETTE.muted }}>
              {isReady ? "Autosaving locally" : "Loading local draft"}
            </div>
          </div>

          <div className="space-y-5">
            {STARTUP_LENS_LAYERS.map((layer) => {
              const layerStyle = LAYER_STYLES[layer.id as keyof typeof LAYER_STYLES]
              const layerCompleted = getLayerCompletedQuestionCount(layer.id, draft)
              const layerTotal = getLayerQuestionCount(layer.id)
              const LayerIcon = LAYER_ICONS[layer.id]
              const isCollapsed = collapsedLayers.includes(layer.id)

              return (
                <section
                  id={`startup-lens-layer-${layer.id}`}
                  key={layer.id}
                  className="overflow-hidden rounded-lg border scroll-mt-8"
                  style={{
                    borderColor: layerStyle.border,
                    background: activeLayer === layer.id ? layerStyle.washStrong : PALETTE.surface,
                    boxShadow: activeLayer === layer.id ? `0 18px 60px ${layerStyle.washSoft}` : "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleLayer(layer.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border"
                        style={{ borderColor: layerStyle.border, background: layerStyle.washSoft, color: layerStyle.accent }}
                      >
                        <LayerIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="studio-label mb-1">
                          Layer {String(layer.id).padStart(2, "0")}
                        </p>
                        <h3 className="text-xl font-semibold leading-tight sm:text-2xl" style={{ color: PALETTE.text }}>
                          {layer.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-3">
                      <div
                        className="rounded-full border px-3 py-1 text-xs font-semibold"
                        style={{ borderColor: layerStyle.border, color: PALETTE.text, background: PALETTE.surface3 }}
                      >
                        {layerCompleted} / {layerTotal}
                      </div>
                      <div style={{ color: PALETTE.muted }}>
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </div>
                    </div>
                  </button>

                  {!isCollapsed && (
                    <div className="border-t px-5 pb-5 pt-6 sm:px-6 sm:pb-6" style={{ borderColor: layerStyle.border }}>
                      <div className="space-y-6">
                        {layer.clusters.map((cluster, clusterIndex) => (
                          <div key={`${layer.id}-${cluster.title}`} className="space-y-4">
                            <div className="flex items-center gap-3">
                              <p className="studio-label">
                                {cluster.title}
                              </p>
                              <div className="h-px flex-1" style={{ background: layerStyle.border }} />
                            </div>

                            <div className="space-y-4">
                              {cluster.questions.map((question, questionIndex) => {
                                const questionId = getStartupLensQuestionId(layer.id, clusterIndex, questionIndex)
                                const answer = draft.answers[questionId] || ""
                                const hasAnswer = answer.trim().length > 0

                                return (
                                  <div
                                    key={questionId}
                                    className="rounded-lg border p-4"
                                    style={{
                                      borderColor: hasAnswer ? layerStyle.border : PALETTE.border,
                                      background: hasAnswer ? layerStyle.washSoft : PALETTE.surface2,
                                    }}
                                  >
                                    <p className="mb-3 text-sm italic leading-7" style={{ color: PALETTE.muted }}>
                                      {question}
                                    </p>
                                    <textarea
                                      rows={4}
                                      value={answer}
                                      onChange={(event) => updateAnswer(questionId, event.target.value)}
                                      placeholder="Your research notes..."
                                      className={answerAreaClass}
                                      style={{
                                        borderColor: hasAnswer ? layerStyle.border : PALETTE.border,
                                      }}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}

                        <div
                          className="rounded-lg border p-5"
                          style={{
                            borderColor: layerStyle.border,
                            background: layerStyle.washStrong,
                          }}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-lg border"
                              style={{ borderColor: layerStyle.border, background: PALETTE.surface3, color: layerStyle.accent }}
                            >
                              <Lightbulb className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="studio-label text-[11px]">
                                Layer synthesis
                              </p>
                              <p className="text-sm" style={{ color: PALETTE.muted }}>
                                Write the conclusion that should survive after all the notes are gone.
                              </p>
                            </div>
                          </div>
                          <textarea
                            rows={4}
                            value={draft.syntheses[String(layer.id)] || ""}
                            onChange={(event) => updateSynthesis(layer.id, event.target.value)}
                            placeholder={layer.synthesisPrompt}
                            className={synthesisAreaClass}
                            style={{ borderColor: layerStyle.border }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-8 xl:self-start">
          <section
            className="rounded-lg border p-[24px]"
            style={{
              borderColor: PALETTE.border,
              background: "linear-gradient(180deg, rgba(212,168,83,0.12) 0%, rgba(24,24,31,0.98) 100%)",
            }}
          >
            <p className="studio-label mb-2">
              Completion snapshot
            </p>
            <div className="text-4xl font-semibold tracking-[-0.04em]" style={{ color: PALETTE.text }}>
              {progressPercent}%
            </div>
            <p className="mt-2 text-sm leading-7" style={{ color: PALETTE.muted }}>
              {completedQuestions} answered of {STARTUP_LENS_TOTAL_QUESTIONS}. Use the layer map below to jump through the
              research flow.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3" style={{ borderColor: PALETTE.border, background: PALETTE.surface3 }}>
                <div className="studio-label text-[10px]">
                  Company
                </div>
                <div className="mt-2 text-sm font-medium" style={{ color: PALETTE.text }}>
                  {draft.companyName.trim() || "Not set"}
                </div>
              </div>
              <div className="rounded-lg border p-3" style={{ borderColor: PALETTE.border, background: PALETTE.surface3 }}>
                <div className="studio-label text-[10px]">
                  Status
                </div>
                <div className="mt-2 text-sm font-medium" style={{ color: PALETTE.text }}>
                  {draft.metaStatus || "Unknown"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border p-3" style={{ borderColor: PALETTE.border, background: PALETTE.surface }}>
            <div className="mb-2 px-2 pt-2">
              <p className="studio-label">
                Layer map
              </p>
            </div>

            <div className="space-y-2">
              {STARTUP_LENS_LAYERS.map((layer) => {
                const layerStyle = LAYER_STYLES[layer.id as keyof typeof LAYER_STYLES]
                const layerCompleted = getLayerCompletedQuestionCount(layer.id, draft)
                const layerTotal = getLayerQuestionCount(layer.id)

                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => scrollToLayer(layer.id)}
                    className="w-full rounded-lg border px-4 py-3 text-left transition-colors"
                    style={{
                      borderColor: activeLayer === layer.id ? layerStyle.border : PALETTE.border,
                      background: activeLayer === layer.id ? layerStyle.washSoft : PALETTE.surface3,
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="studio-label text-[10px]">
                        {String(layer.id).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-medium" style={{ color: PALETTE.muted }}>
                        {layerCompleted}/{layerTotal}
                      </span>
                    </div>
                    <div className="text-sm font-medium leading-6" style={{ color: PALETTE.text }}>
                      {layer.title}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border p-5" style={{ borderColor: PALETTE.border, background: PALETTE.surface }}>
            <p className="studio-label mb-2">
              Export notes
            </p>
            <p className="text-sm leading-7" style={{ color: PALETTE.text }}>
              The PDF includes company metadata, every question, answered notes, and each layer synthesis.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: PALETTE.success }}>
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE.success }} />
              Browser draft stays saved between refreshes on this device.
            </div>
          </section>
        </aside>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-full border px-4 py-3 text-sm shadow-lg"
          style={{
            borderColor:
              toast.tone === "error" ? "rgba(192,81,74,0.45)" : toast.tone === "success" ? "rgba(77,158,106,0.45)" : PALETTE.border,
            background:
              toast.tone === "error"
                ? "rgba(192,81,74,0.18)"
                : toast.tone === "success"
                  ? "rgba(77,158,106,0.18)"
                  : "rgba(24,24,31,0.96)",
            color: PALETTE.text,
          }}
        >
          {toast.message}
        </div>
      )}
    </>
  )
}

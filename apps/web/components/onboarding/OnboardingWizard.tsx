"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Copy, KeyRound, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface PersonaOption {
  label: string
  templateKey: string
  description: string
}

const PERSONAS: PersonaOption[] = [
  { label: "Solo Dev", templateKey: "solo-dev", description: "Ship code and track outputs as a one-person team." },
  { label: "Indie Hacker", templateKey: "indie-hacker", description: "Build products and chase revenue on your own terms." },
  { label: "Agency Owner", templateKey: "agency-owner", description: "Run client work with proof-driven accountability." },
  { label: "Freelancer", templateKey: "freelancer", description: "Win projects and keep delivery on track solo." },
]

const TEMPLATES: PersonaOption[] = [
  { label: "Solo Dev", templateKey: "solo-dev", description: "Outreach, deep work sessions, and shipped-code proof." },
  { label: "Indie Hacker", templateKey: "indie-hacker", description: "Product progress, launches, and revenue attempts." },
  { label: "Agency Owner", templateKey: "agency-owner", description: "Client outreach, deliverables, and proof links." },
  { label: "Freelancer", templateKey: "freelancer", description: "Proposals, work blocks, and client-ready outputs." },
]

const STEPS = ["Persona", "Starter flow", "Connect MCP"]

function mcpCommand(key: string) {
  return `claude mcp add founderbox --transport http https://mcp.founderbox.loopxo.org/mcp --header "Authorization: Bearer ${key}"`
}

export default function OnboardingWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()

  const [step, setStep] = useState(0)
  const [persona, setPersona] = useState<string>("")
  const [templateKey, setTemplateKey] = useState<string>("")
  const [mcpKey, setMcpKey] = useState<string>("")
  const [generating, setGenerating] = useState(false)
  const [finishing, setFinishing] = useState(false)

  const canNext = step === 0 ? Boolean(persona) : step === 1 ? Boolean(templateKey) : true

  async function generateKey() {
    if (generating) return
    setGenerating(true)
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Onboarding MCP key" }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.key) throw new Error(json.error || "Could not generate key.")
      setMcpKey(json.key as string)
      toast.success("MCP key generated", "Copy it now — it won't be shown again.")
    } catch (error) {
      toast.error("Key generation failed", error instanceof Error ? error.message : "Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied")
    } catch {
      toast.error("Copy failed", "Copy the text manually.")
    }
  }

  async function finish() {
    if (finishing) return
    setFinishing(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, templateKey }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not complete onboarding.")
      router.push(searchParams.get("next") || "/accountability/today")
    } catch (error) {
      toast.error("Onboarding failed", error instanceof Error ? error.message : "Please try again.")
      setFinishing(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-[#18181F] p-6">
      {/* Step progress indicator */}
      <div className="mb-6 flex items-center gap-2" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                index < step
                  ? "border-[#D4A853] bg-[#D4A853] text-[#111118]"
                  : index === step
                    ? "border-[#D4A853] text-[#D4A853]"
                    : "border-border text-[#68634F]"
              )}
            >
              {index < step ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:inline",
                index === step ? "text-[#EDE9DC]" : "text-[#9E9880]"
              )}
            >
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <div className={cn("h-px flex-1", index < step ? "bg-[#D4A853]" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: persona */}
      {step === 0 && (
        <div>
          <p className="studio-label mb-1.5">Step 1</p>
          <h2 className="text-lg font-bold text-[#EDE9DC]">Pick your persona</h2>
          <p className="mb-5 mt-1 text-sm text-[#9E9880]">This tailors your accountability OS to how you work.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {PERSONAS.map((option) => {
              const selected = persona === option.templateKey
              return (
                <button
                  key={option.templateKey}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPersona(option.templateKey)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-[#D4A853] bg-[#D4A853]/10"
                      : "border-border bg-[#111118] hover:border-[#D4A853]/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#EDE9DC]">{option.label}</p>
                    {selected && <Check className="h-4 w-4 text-[#D4A853]" />}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#9E9880]">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: starter flow template */}
      {step === 1 && (
        <div>
          <p className="studio-label mb-1.5">Step 2</p>
          <h2 className="text-lg font-bold text-[#EDE9DC]">Choose a starter flow</h2>
          <p className="mb-5 mt-1 text-sm text-[#9E9880]">We&apos;ll install this template so you can start logging right away.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {TEMPLATES.map((option) => {
              const selected = templateKey === option.templateKey
              return (
                <button
                  key={option.templateKey}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTemplateKey(option.templateKey)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-[#D4A853] bg-[#D4A853]/10"
                      : "border-border bg-[#111118] hover:border-[#D4A853]/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#EDE9DC]">{option.label}</p>
                    {selected && <Check className="h-4 w-4 text-[#D4A853]" />}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#9E9880]">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 3: connect MCP key */}
      {step === 2 && (
        <div>
          <p className="studio-label mb-1.5">Step 3</p>
          <h2 className="text-lg font-bold text-[#EDE9DC]">Connect your AI client</h2>
          <p className="mb-5 mt-1 text-sm text-[#9E9880]">
            Generate an MCP key to log from Claude and other AI clients. This step is optional — you can finish and do it later.
          </p>

          {!mcpKey ? (
            <button
              type="button"
              onClick={generateKey}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-md bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {generating ? <Spinner className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
              {generating ? "Generating…" : "Generate MCP key"}
            </button>
          ) : (
            <div className="space-y-4">
              <Field label="Your MCP key" htmlFor="mcp-key" hint="Shown once — copy it somewhere safe.">
                <div className="flex items-center gap-2">
                  <Input id="mcp-key" readOnly value={mcpKey} className="font-mono text-xs" />
                  <button
                    type="button"
                    onClick={() => copy(mcpKey)}
                    aria-label="Copy MCP key"
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-border bg-[#111118] px-3 text-xs font-medium text-[#EDE9DC] transition-colors hover:border-[#D4A853]/40"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </Field>

              <Field label="Connect command" htmlFor="mcp-command" hint="Run this in your terminal.">
                <div className="flex items-start gap-2">
                  <code
                    id="mcp-command"
                    className="block flex-1 overflow-x-auto rounded-md border border-border bg-[#111118] px-3 py-2.5 font-mono text-xs leading-relaxed text-[#EDE9DC]"
                  >
                    {mcpCommand(mcpKey)}
                  </code>
                  <button
                    type="button"
                    onClick={() => copy(mcpCommand(mcpKey))}
                    aria-label="Copy connect command"
                    className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-border bg-[#111118] px-3 text-xs font-medium text-[#EDE9DC] transition-colors hover:border-[#D4A853]/40"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                </div>
              </Field>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || finishing}
          className="rounded-md border border-border bg-[#111118] px-4 py-2 text-sm font-medium text-[#EDE9DC] transition-colors hover:border-[#D4A853]/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canNext}
            className="inline-flex items-center gap-2 rounded-md bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={finishing}
            className="inline-flex items-center gap-2 rounded-md bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {finishing ? <Spinner className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {finishing ? "Finishing…" : "Finish"}
          </button>
        )}
      </div>
    </div>
  )
}

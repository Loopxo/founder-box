"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Send, Briefcase, Rocket, FileCheck, Moon } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type Mode = "outreach" | "work" | "product" | "proof" | "review"

const MODES: { key: Mode; label: string; icon: typeof Send; path: string }[] = [
  { key: "outreach", label: "Outreach", icon: Send, path: "/api/accountability/outreach" },
  { key: "work", label: "Work", icon: Briefcase, path: "/api/accountability/work-session" },
  { key: "product", label: "Product", icon: Rocket, path: "/api/accountability/product-progress" },
  { key: "proof", label: "Proof", icon: FileCheck, path: "/api/accountability/proof" },
  { key: "review", label: "End Day", icon: Moon, path: "/api/accountability/end-day" },
]

const CHANNELS = ["LinkedIn", "Email", "WhatsApp", "Twitter/X", "Cold Call", "DM", "Referral", "Other"]
const OUTCOMES = ["Sent", "Opened", "Replied", "Call Booked", "Proposal Sent", "Closed", "No Response"]
const STAGES = ["Idea", "Building", "Testing", "Deployed", "Launched", "Iterating"]
const PROOF_TYPES = ["deploy", "commit", "design", "document", "screenshot", "link", "other"]

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-[#111118] px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring"

async function postJson(path: string, data: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const json = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(json.error || "Request failed.")
  return json
}

export default function QuickLogPanel() {
  const router = useRouter()
  const toast = useToast()
  const [mode, setMode] = useState<Mode>("outreach")
  const [pending, setPending] = useState(false)

  function readForm(form: HTMLFormElement) {
    return Object.fromEntries(new FormData(form).entries())
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const config = MODES.find((m) => m.key === mode)!
    setPending(true)

    try {
      if (mode === "proof") {
        const data = new FormData(form)
        const file = data.get("file")
        if (file instanceof File && file.size > 0) {
          const upload = await postJson("/api/proof/upload-url", {
            type: String(data.get("type") || "other"),
            label: String(data.get("label") || file.name),
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          })
          const put = await fetch(upload.uploadUrl, {
            method: "PUT",
            headers: { "content-type": file.type || "application/octet-stream" },
            body: file,
          })
          if (!put.ok) throw new Error("File upload failed. Check storage configuration.")
          await postJson(`/api/proof/${upload.proof.id}/complete`, {})
        } else {
          await postJson(config.path, {
            type: data.get("type") || "other",
            label: data.get("label"),
            url: data.get("url"),
            text: data.get("text"),
          })
        }
      } else {
        await postJson(config.path, readForm(form))
      }

      form.reset()
      toast.success(`${config.label} logged`, "Your proof was recorded.")
      router.refresh()
    } catch (error) {
      toast.error("Could not log entry", error instanceof Error ? error.message : "Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-[#18181F]">
      {/* Mode tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border p-2">
        {MODES.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              mode === key
                ? "bg-[#D4A853] text-[#111118]"
                : "text-[#9E9880] hover:bg-white/[0.03] hover:text-[#EDE9DC]"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Form — keyed by mode so inputs reset between tabs */}
      <form key={mode} onSubmit={handleSubmit} className="p-5">
        {mode === "outreach" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Channel" htmlFor="channel">
              <select id="channel" name="channel" className={selectClass} defaultValue="LinkedIn">
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Outcome" htmlFor="outcome">
              <select id="outcome" name="outcome" className={selectClass} defaultValue="Sent">
                {OUTCOMES.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Method" htmlFor="methodUsed" hint="What approach did you use?">
              <Input id="methodUsed" name="methodUsed" placeholder="Homepage preview" />
            </Field>
            <Field label="Offer" htmlFor="offerSent">
              <Input id="offerSent" name="offerSent" placeholder="Free audit" />
            </Field>
          </div>
        )}

        {mode === "work" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project" htmlFor="project" required>
              <Input id="project" name="project" placeholder="FounderBox" required />
            </Field>
            <Field label="Minutes" htmlFor="durationMinutes">
              <Input id="durationMinutes" name="durationMinutes" type="number" min={0} step={5} placeholder="90" />
            </Field>
            <Field label="Output created" htmlFor="outputCreated" required className="sm:col-span-2">
              <Input id="outputCreated" name="outputCreated" placeholder="Shipped API route" required />
            </Field>
            <Field label="Proof link" htmlFor="proofLink" className="sm:col-span-2">
              <Input id="proofLink" name="proofLink" type="url" placeholder="https://..." />
            </Field>
          </div>
        )}

        {mode === "product" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product" htmlFor="product" required>
              <Input id="product" name="product" placeholder="Loopxo" required />
            </Field>
            <Field label="Stage" htmlFor="stage">
              <select id="stage" name="stage" className={selectClass} defaultValue="Building">
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Feature" htmlFor="featureWorkedOn" required className="sm:col-span-2">
              <Input id="featureWorkedOn" name="featureWorkedOn" placeholder="Weekly proof report" required />
            </Field>
            <Field label="Proof link" htmlFor="productProofLink" className="sm:col-span-2">
              <Input id="productProofLink" name="proofLink" type="url" placeholder="https://..." />
            </Field>
          </div>
        )}

        {mode === "proof" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type" htmlFor="type">
              <select id="type" name="type" className={selectClass} defaultValue="deploy">
                {PROOF_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Label" htmlFor="label" required>
              <Input id="label" name="label" placeholder="Vercel deploy" required />
            </Field>
            <Field label="URL" htmlFor="url">
              <Input id="url" name="url" type="url" placeholder="https://..." />
            </Field>
            <Field label="File" htmlFor="file" hint="Or upload a file as proof">
              <Input id="file" name="file" type="file" className="file:mr-3 file:rounded file:bg-[#1E1E28] file:px-2 file:py-1 file:text-[#EDE9DC]" />
            </Field>
            <Field label="Note" htmlFor="text" className="sm:col-span-2">
              <Textarea id="text" name="text" placeholder="What this proves" />
            </Field>
          </div>
        )}

        {mode === "review" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Biggest output" htmlFor="biggestOutput" className="sm:col-span-2">
              <Input id="biggestOutput" name="biggestOutput" placeholder="What you shipped today" />
            </Field>
            <Field label="Method that worked" htmlFor="methodWorked">
              <Input id="methodWorked" name="methodWorked" placeholder="Cold DM with loom" />
            </Field>
            <Field label="What vanished" htmlFor="vanished">
              <Input id="vanished" name="vanished" placeholder="Time lost to..." />
            </Field>
            <Field label="End of day review" htmlFor="endOfDayReview" className="sm:col-span-2">
              <Textarea id="endOfDayReview" name="endOfDayReview" placeholder="Honest reflection on the day" />
            </Field>
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-md bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending && <Spinner className="h-4 w-4" />}
            {pending ? "Saving…" : "Save"}
          </button>
          <span className="text-xs text-[#68634F]">Logged to today&apos;s feed instantly</span>
        </div>
      </form>
    </div>
  )
}

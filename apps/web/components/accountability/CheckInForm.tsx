"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

const MOODS = ["Sharp", "Focused", "Steady", "Tired", "Distracted", "Anxious"]

export default function CheckInForm() {
  const router = useRouter()
  const toast = useToast()
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setPending(true)
    try {
      const response = await fetch("/api/accountability/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const json = await response.json().catch(() => ({}))
        throw new Error(json.error || "Could not save check-in.")
      }
      form.reset()
      toast.success("Check-in saved", "Your day is set. Go make it count.")
      router.refresh()
    } catch (error) {
      toast.error("Could not save check-in", error instanceof Error ? error.message : undefined)
    } finally {
      setPending(false)
    }
  }

  const selectClass =
    "flex h-10 w-full rounded-md border border-border bg-[#111118] px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-ring"

  return (
    <form onSubmit={submit} className="rounded-lg border border-border bg-[#18181F] p-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <Field label="Wake-up time" htmlFor="wakeUpTime">
          <Input id="wakeUpTime" name="wakeUpTime" type="time" defaultValue="06:30" />
        </Field>
        <Field label="Mood" htmlFor="mood">
          <select id="mood" name="mood" className={selectClass} defaultValue="Focused">
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Energy" htmlFor="energy" hint="1 = drained, 10 = peak">
          <Input id="energy" name="energy" type="number" min={1} max={10} placeholder="7" />
        </Field>
        <Field label="Planned deep work (min)" htmlFor="deepWorkMinutes">
          <Input id="deepWorkMinutes" name="deepWorkMinutes" type="number" min={0} step={15} placeholder="120" />
        </Field>
        <Field label="Main goal today" htmlFor="mainGoal" className="lg:col-span-2">
          <Input id="mainGoal" name="mainGoal" placeholder="Ship one useful thing and make revenue attempts" />
        </Field>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending && <Spinner className="h-4 w-4" />}
        {pending ? "Saving…" : "Save Check-in"}
      </button>
    </form>
  )
}

"use client"

import { FormEvent, useState } from "react"
import { useToast } from "@/components/ui/toast"

export default function SettingsForm({
  workspaceName,
  persona,
  dailyReminder,
  weeklyReview,
  reminderTime,
  timezone,
}: {
  workspaceName: string
  persona?: string | null
  dailyReminder?: boolean
  weeklyReview?: boolean
  reminderTime?: string | null
  timezone?: string | null
}) {
  const toast = useToast()
  const [saving, setSaving] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const reminderTimeValue = (data.get("reminderTime") as string) || ""

    setSaving(true)
    try {
      const response = await fetch("/api/accountability/settings", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workspaceName: data.get("workspaceName"),
          persona: data.get("persona"),
          dailyReminder: data.get("dailyReminder") === "on",
          weeklyReview: data.get("weeklyReview") === "on",
          reminderTime: reminderTimeValue || null,
          timezone: browserTimezone,
        }),
      })
      const json = await response.json().catch(() => ({}))
      if (response.ok) {
        toast.success("Settings saved.")
      } else {
        toast.error("Could not save settings.", json.error)
      }
    } catch {
      toast.error("Could not save settings.", "Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const input = "w-full rounded border border-[#2A2A38] bg-[#111118] px-3 py-2 text-sm text-[#EDE9DC] outline-none"

  return (
    <form onSubmit={submit} className="mt-5 rounded border border-[#2A2A38] bg-[#18181F] p-5">
      <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">Edit Workspace</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        <input name="workspaceName" defaultValue={workspaceName} className={input} placeholder="Workspace name" />
        <input name="persona" defaultValue={persona || ""} className={input} placeholder="solo dev" />
        <label className="flex flex-col gap-1 text-xs text-[#9E9880]">
          Reminder time
          <input name="reminderTime" type="time" defaultValue={reminderTime || ""} className={input} />
        </label>
        <input type="hidden" name="timezone" defaultValue={timezone || ""} />
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#EDE9DC]">
        <label className="flex items-center gap-2"><input name="dailyReminder" type="checkbox" defaultChecked={dailyReminder} /> Daily reminder</label>
        <label className="flex items-center gap-2"><input name="weeklyReview" type="checkbox" defaultChecked={weeklyReview ?? true} /> Weekly review</label>
      </div>
      <button
        disabled={saving}
        className="mt-4 rounded bg-[#D4A853] px-3 py-2 text-sm font-semibold text-[#111118] disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </form>
  )
}

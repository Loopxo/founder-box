"use client"

import { FormEvent, useState } from "react"

export default function QuickLeadForm() {
  const [message, setMessage] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    const response = await fetch("/api/accountability/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await response.json().catch(() => ({}))
    if (!response.ok) {
      setMessage(json.error || "Could not save lead.")
      return
    }
    form.reset()
    setMessage("Lead saved.")
    window.location.reload()
  }

  const input = "w-full rounded border border-[#2A2A38] bg-[#111118] px-3 py-2 text-sm text-[#EDE9DC] outline-none"

  return (
    <form onSubmit={submit} className="rounded border border-[#2A2A38] bg-[#18181F] p-4">
      <div className="grid gap-3 lg:grid-cols-6">
        <input name="clientName" className={input} placeholder="Client name" />
        <input name="businessType" className={input} placeholder="Business type" />
        <input name="source" className={input} placeholder="LinkedIn" />
        <input name="status" className={input} placeholder="New" />
        <input name="potentialValue" className={input} placeholder="Value" />
        <input name="nextFollowUpDate" className={input} placeholder="YYYY-MM-DD" />
      </div>
      <textarea name="notes" className={`${input} mt-3`} placeholder="Notes" />
      <button className="mt-3 rounded bg-[#D4A853] px-3 py-2 text-sm font-semibold text-[#111118]">Save Lead</button>
      {message && <p className="mt-3 text-sm text-[#D4A853]">{message}</p>}
    </form>
  )
}


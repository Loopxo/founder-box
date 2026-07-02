"use client"

import { FormEvent, useState } from "react"

export default function OutreachImportForm() {
  const [message, setMessage] = useState("")

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const csv = String(new FormData(event.currentTarget).get("csv") || "")
    const response = await fetch("/api/accountability/outreach/import", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ csv }),
    })
    const json = await response.json().catch(() => ({}))
    if (!response.ok) {
      setMessage(json.error || "Import failed.")
      return
    }
    setMessage(`Imported ${json.imported} outreach rows.`)
    window.location.reload()
  }

  return (
    <form onSubmit={submit} className="mb-5 rounded border border-[#2A2A38] bg-[#18181F] p-4">
      <h2 className="text-sm font-semibold text-[#EDE9DC]">Import Outreach CSV</h2>
      <textarea
        name="csv"
        className="mt-3 min-h-24 w-full rounded border border-[#2A2A38] bg-[#111118] px-3 py-2 text-sm text-[#EDE9DC] outline-none"
        placeholder="date,channel,method,outcome,reply&#10;2026-05-17,LinkedIn,Homepage preview,Replied,true"
      />
      <button className="mt-3 rounded bg-[#D4A853] px-3 py-2 text-sm font-semibold text-[#111118]">Import CSV</button>
      {message && <p className="mt-3 text-sm text-[#D4A853]">{message}</p>}
    </form>
  )
}


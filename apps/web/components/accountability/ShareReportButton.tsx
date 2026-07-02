"use client"

import { useState } from "react"

export default function ShareReportButton() {
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  async function create() {
    setError("")
    const response = await fetch("/api/share-links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
    const json = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(json.error || "Could not create share link.")
      return
    }
    setUrl(json.url)
  }

  return (
    <div>
      <button onClick={create} className="rounded bg-[#D4A853] px-3 py-2 text-sm font-semibold text-[#111118]">
        Create Share Report
      </button>
      {url && <p className="mt-3 text-sm text-[#D4A853]">{url}</p>}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </div>
  )
}

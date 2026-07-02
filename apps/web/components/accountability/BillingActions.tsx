"use client"

import { useState } from "react"

export default function BillingActions() {
  const [error, setError] = useState("")

  async function go(path: string) {
    setError("")
    const response = await fetch(path, { method: "POST" })
    const json = await response.json().catch(() => ({}))
    if (!response.ok || !json.url) {
      setError(json.error || "Billing action failed.")
      return
    }
    window.location.href = json.url
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button onClick={() => go("/api/billing/checkout")} className="rounded bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118]">
        Upgrade to Founding Pro
      </button>
      <button onClick={() => go("/api/billing/portal")} className="rounded border border-[#2A2A38] px-4 py-2 text-sm font-semibold text-[#EDE9DC]">
        Customer Portal
      </button>
      {error && <p className="basis-full text-sm text-red-300">{error}</p>}
    </div>
  )
}

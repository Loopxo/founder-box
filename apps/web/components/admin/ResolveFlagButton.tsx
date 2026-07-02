"use client"

import { useState } from "react"

export default function ResolveFlagButton({ id, disabled }: { id: string; disabled?: boolean }) {
  const [done, setDone] = useState(disabled)

  async function resolve() {
    const response = await fetch(`/api/admin/flags/${id}/resolve`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    })
    if (response.ok) setDone(true)
  }

  return (
    <button disabled={done} onClick={resolve} className="rounded border border-[#2A2A38] px-2 py-1 text-xs font-semibold text-[#EDE9DC] disabled:opacity-50">
      {done ? "Resolved" : "Resolve"}
    </button>
  )
}


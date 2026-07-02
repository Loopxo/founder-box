"use client"

import { useState } from "react"

export default function RetryWebhookButton({ id, disabled }: { id: string; disabled?: boolean }) {
  const [message, setMessage] = useState("")

  async function retry() {
    const response = await fetch(`/api/admin/webhooks/${id}/retry`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    })
    setMessage(response.ok ? "Retried" : "Failed")
  }

  return (
    <div>
      <button disabled={disabled} onClick={retry} className="rounded border border-[#2A2A38] px-2 py-1 text-xs font-semibold text-[#EDE9DC] disabled:opacity-50">
        Retry
      </button>
      {message && <p className="mt-1 text-xs text-[#9E9880]">{message}</p>}
    </div>
  )
}


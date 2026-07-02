"use client"

import { useState } from "react"

export default function AccountDangerZone({ email }: { email: string }) {
  const [confirm, setConfirm] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  async function deleteAccount() {
    setMessage("")
    setError("")
    const response = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ confirm }),
    })
    const json = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(json.error || "Could not delete account.")
      return
    }
    window.location.href = "/"
  }

  return (
    <section className="rounded border border-red-900/60 bg-[#18181F] p-5">
      <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">Data And Deletion</h2>
      <div className="flex flex-wrap gap-3">
        <a href="/api/account/export" className="rounded border border-[#2A2A38] px-3 py-2 text-sm font-semibold text-[#EDE9DC]">Export Data</a>
        <input value={confirm} onChange={(event) => setConfirm(event.target.value)} className="min-w-64 rounded border border-[#2A2A38] bg-[#111118] px-3 py-2 text-sm text-[#EDE9DC] outline-none" placeholder={email} />
        <button onClick={deleteAccount} className="rounded bg-red-500 px-3 py-2 text-sm font-semibold text-white">Delete Account</button>
      </div>
      {message && <p className="mt-3 text-sm text-[#D4A853]">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </section>
  )
}


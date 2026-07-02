"use client"

import Link from "next/link"
import { Flame, X } from "lucide-react"
import { useEffect, useState } from "react"

function todayKey() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  return `fb_nudge_${yyyy}-${mm}-${dd}`
}

export default function ReminderBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem(todayKey())
      setVisible(dismissed !== "1")
    } catch {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    try {
      window.localStorage.setItem(todayKey(), "1")
    } catch {
      // ignore storage failures
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#D4A853]/40 bg-[#D4A853]/10 px-4 py-3">
      <Flame className="h-5 w-5 shrink-0 text-[#D4A853]" />
      <p className="flex-1 text-sm text-[#EDE9DC]">
        Keep your streak alive —{" "}
        <Link href="/accountability/today" className="font-semibold text-[#D4A853] underline-offset-2 hover:underline">
          log today&apos;s proof
        </Link>
        .
      </p>
      <button
        onClick={dismiss}
        className="shrink-0 text-[#9E9880] opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss reminder"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

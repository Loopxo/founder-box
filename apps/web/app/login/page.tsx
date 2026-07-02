"use client"

import { FormEvent, Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function requestOtp(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    const response = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const payload = await response.json()
    setLoading(false)
    if (!response.ok) {
      setMessage(payload.error || "Could not send code.")
      return
    }
    setSent(true)
    setMessage(payload.devCode ? `Dev code: ${payload.devCode}` : "Check your email for the 6-digit code.")
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage("")
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, code }),
    })
    const payload = await response.json()
    if (!response.ok) {
      setLoading(false)
      setMessage(payload.error || "Could not verify code.")
      return
    }
    router.push(params.get("next") || "/accountability/today")
  }

  const next = encodeURIComponent(params.get("next") || "/accountability/today")

  return (
    <main style={{ minHeight: "100vh", background: "#111118", color: "#EDE9DC", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, border: "1px solid #2A2A38", borderRadius: 8, background: "#18181F", padding: 28 }}>
        <p style={{ color: "#D4A853", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>FounderBox</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Sign in</h1>
        <p style={{ color: "#9E9880", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Sign in to track daily proof and connect FounderBox to AI clients.</p>

        <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
          <a href={`/api/auth/oauth/google/start?next=${next}`} style={{ display: "block", textAlign: "center", border: "1px solid #2A2A38", borderRadius: 6, padding: "11px 14px", color: "#EDE9DC", fontWeight: 700 }}>
            Continue with Google
          </a>
          <a href={`/api/auth/oauth/github/start?next=${next}`} style={{ display: "block", textAlign: "center", border: "1px solid #2A2A38", borderRadius: 6, padding: "11px 14px", color: "#EDE9DC", fontWeight: 700 }}>
            Continue with GitHub
          </a>
        </div>

        <div style={{ height: 1, background: "#2A2A38", marginBottom: 18 }} />

        {!sent ? (
          <form onSubmit={requestOtp}>
            <label style={{ display: "block", fontSize: 13, color: "#9E9880", marginBottom: 8 }}>Email</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required style={{ width: "100%", background: "#111118", border: "1px solid #2A2A38", color: "#EDE9DC", borderRadius: 6, padding: "12px 14px", marginBottom: 16 }} />
            <button disabled={loading} style={{ width: "100%", background: "#D4A853", color: "#111118", border: 0, borderRadius: 6, padding: "12px 14px", fontWeight: 800 }}>
              {loading ? "Sending..." : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <label style={{ display: "block", fontSize: 13, color: "#9E9880", marginBottom: 8 }}>6-digit code</label>
            <input value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" required style={{ width: "100%", background: "#111118", border: "1px solid #2A2A38", color: "#EDE9DC", borderRadius: 6, padding: "12px 14px", marginBottom: 16 }} />
            <button disabled={loading} style={{ width: "100%", background: "#D4A853", color: "#111118", border: 0, borderRadius: 6, padding: "12px 14px", fontWeight: 800 }}>
              {loading ? "Verifying..." : "Verify and continue"}
            </button>
          </form>
        )}

        {message && <p style={{ color: "#D4A853", fontSize: 13, marginTop: 16 }}>{message}</p>}
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", background: "#111118" }} />}>
      <LoginForm />
    </Suspense>
  )
}

import Link from "next/link"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#111118] px-6 py-16 text-[#EDE9DC]">
      <div className="mx-auto max-w-5xl">
        <p className="studio-label mb-3">FounderBox Pricing</p>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight">Daily proof for solo operators.</h1>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded border border-[#2A2A38] bg-[#18181F] p-6">
            <h2 className="text-xl font-bold">Free</h2>
            <p className="mt-2 text-3xl font-extrabold">$0</p>
            <ul className="mt-5 space-y-3 text-sm text-[#9E9880]">
              <li>1 workspace</li>
              <li>1 active custom flow</li>
              <li>30-day history</li>
              <li>Manual proof links</li>
              <li>Limited share reports</li>
            </ul>
            <Link href="/login" className="mt-6 inline-block rounded border border-[#2A2A38] px-4 py-2 text-sm font-semibold">Start Free</Link>
          </div>
          <div className="rounded border border-[#D4A853] bg-[#18181F] p-6">
            <h2 className="text-xl font-bold">Founding Pro</h2>
            <p className="mt-2 text-3xl font-extrabold">$8/month</p>
            <ul className="mt-5 space-y-3 text-sm text-[#9E9880]">
              <li>Unlimited flows</li>
              <li>Unlimited history</li>
              <li>Advanced widgets</li>
              <li>Share reports and exports</li>
              <li>Higher accountability MCP usage</li>
            </ul>
            <Link href="/billing" className="mt-6 inline-block rounded bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118]">Upgrade</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

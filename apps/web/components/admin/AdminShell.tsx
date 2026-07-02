import Link from "next/link"

const LINKS = [
  ["/admin", "Overview"],
  ["/admin/users", "Users"],
  ["/admin/usage", "Usage"],
  ["/admin/tool-runs", "Tool Runs"],
  ["/admin/webhooks", "Webhooks"],
  ["/admin/audit", "Audit"],
  ["/admin/flags", "Flags"],
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#111118] px-6 py-8 text-[#EDE9DC]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#2A2A38] pb-5">
          <div>
            <p className="studio-label mb-2">FounderBox Admin</p>
            <h1 className="text-2xl font-bold">Operations</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {LINKS.map(([href, label]) => (
              <Link key={href} href={href} className="rounded border border-[#2A2A38] px-3 py-2 text-xs font-semibold text-[#9E9880] hover:text-[#EDE9DC]">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </main>
  )
}

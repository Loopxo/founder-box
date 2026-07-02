import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminUsagePage() {
  const user = await getCurrentUser()
  if (!isAdmin(user)) redirect("/dashboard")

  const [toolUsage, entries, proofAssets, exports] = await Promise.all([
    prisma.toolRun.groupBy({ by: ["toolName", "status"], _count: { _all: true }, orderBy: { _count: { toolName: "desc" } }, take: 50 }),
    prisma.entry.count(),
    prisma.proofAsset.count(),
    prisma.exportJob.count(),
  ])

  return (
    <AdminShell>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <div className="rounded border border-[#2A2A38] bg-[#18181F] p-5">Entries: {entries}</div>
        <div className="rounded border border-[#2A2A38] bg-[#18181F] p-5">Proof assets: {proofAssets}</div>
        <div className="rounded border border-[#2A2A38] bg-[#18181F] p-5">Exports: {exports}</div>
      </div>
      <div className="rounded border border-[#2A2A38] bg-[#18181F]">
        {toolUsage.map((row) => (
          <div key={`${row.toolName}-${row.status}`} className="grid gap-3 border-b border-[#2A2A38] p-4 text-sm md:grid-cols-3">
            <span>{row.toolName}</span>
            <span className="text-[#9E9880]">{row.status}</span>
            <span className="text-[#9E9880]">{row._count._all}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}

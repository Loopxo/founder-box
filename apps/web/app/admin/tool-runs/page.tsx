import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminToolRunsPage() {
  const user = await getCurrentUser()
  if (!isAdmin(user)) redirect("/dashboard")

  const runs = await prisma.toolRun.findMany({ include: { user: true, apiKey: true }, orderBy: { createdAt: "desc" }, take: 100 })
  return (
    <AdminShell>
      <div className="rounded border border-[#2A2A38] bg-[#18181F]">
        {runs.map((run) => (
          <div key={run.id} className="grid gap-3 border-b border-[#2A2A38] p-4 text-sm lg:grid-cols-6">
            <span className="font-semibold">{run.toolName}</span>
            <span className={run.status === "ok" ? "text-emerald-300" : "text-red-300"}>{run.status}</span>
            <span className="text-[#9E9880]">{run.durationMs}ms</span>
            <span className="text-[#9E9880]">{run.errorCode || "-"}</span>
            <span className="text-[#9E9880]">{run.user?.email || "unknown"}</span>
            <span className="text-[#9E9880]">{run.createdAt.toISOString()}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}

import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"
import ResolveFlagButton from "@/components/admin/ResolveFlagButton"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminFlagsPage() {
  const user = await getCurrentUser()
  if (!isAdmin(user)) redirect("/dashboard")

  const flags = await prisma.suspiciousUsageFlag.findMany({ include: { user: true, workspace: true }, orderBy: { createdAt: "desc" }, take: 100 })
  return (
    <AdminShell>
      <div className="rounded border border-[#2A2A38] bg-[#18181F]">
        {flags.map((flag) => (
          <div key={flag.id} className="grid gap-3 border-b border-[#2A2A38] p-4 text-sm lg:grid-cols-7">
            <span className="font-semibold">{flag.type}</span>
            <span className={flag.severity === "critical" || flag.severity === "high" ? "text-red-300" : "text-[#D4A853]"}>{flag.severity}</span>
            <span className="text-[#9E9880]">{flag.status}</span>
            <span className="text-[#9E9880]">{flag.user?.email || "-"}</span>
            <span className="text-[#9E9880]">{flag.reason}</span>
            <span className="text-[#9E9880]">{flag.createdAt.toISOString()}</span>
            <ResolveFlagButton id={flag.id} disabled={flag.status === "resolved"} />
          </div>
        ))}
      </div>
    </AdminShell>
  )
}

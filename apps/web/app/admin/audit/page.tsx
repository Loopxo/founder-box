import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminAuditPage() {
  const user = await getCurrentUser()
  if (!isAdmin(user)) redirect("/dashboard")

  const events = await prisma.auditEvent.findMany({ include: { user: true, workspace: true }, orderBy: { createdAt: "desc" }, take: 150 })
  return (
    <AdminShell>
      <div className="rounded border border-[#2A2A38] bg-[#18181F]">
        {events.map((event) => (
          <div key={event.id} className="grid gap-3 border-b border-[#2A2A38] p-4 text-sm lg:grid-cols-5">
            <span className="font-semibold">{event.action}</span>
            <span className="text-[#9E9880]">{event.user?.email || "-"}</span>
            <span className="text-[#9E9880]">{event.workspace?.name || "-"}</span>
            <span className="text-[#9E9880]">{event.entityType || "-"}</span>
            <span className="text-[#9E9880]">{event.createdAt.toISOString()}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}

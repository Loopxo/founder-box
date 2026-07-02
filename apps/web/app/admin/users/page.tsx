import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminUsersPage() {
  const user = await getCurrentUser()
  if (!isAdmin(user)) redirect("/dashboard")

  const users = await prisma.user.findMany({
    include: { memberships: { include: { workspace: true } }, subscriptions: { include: { plan: true }, orderBy: { updatedAt: "desc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <AdminShell>
      <div className="rounded border border-[#2A2A38] bg-[#18181F]">
        {users.map((item) => (
          <div key={item.id} className="grid gap-3 border-b border-[#2A2A38] p-4 text-sm lg:grid-cols-5">
            <span className="font-semibold">{item.email}</span>
            <span className="text-[#9E9880]">{item.role}</span>
            <span className="text-[#9E9880]">{item.memberships[0]?.workspace.name || "No workspace"}</span>
            <span className="text-[#9E9880]">{item.subscriptions[0]?.status || "free"}</span>
            <span className="text-[#9E9880]">{item.createdAt.toISOString().slice(0, 10)}</span>
          </div>
        ))}
      </div>
    </AdminShell>
  )
}

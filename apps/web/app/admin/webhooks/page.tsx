import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"
import RetryWebhookButton from "@/components/admin/RetryWebhookButton"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AdminWebhooksPage() {
  const user = await getCurrentUser()
  if (!isAdmin(user)) redirect("/dashboard")

  const events = await prisma.lemonSqueezyEvent.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 100 })
  return (
    <AdminShell>
      <div className="rounded border border-[#2A2A38] bg-[#18181F]">
        {events.map((event) => (
          <div key={event.id} className="grid gap-3 border-b border-[#2A2A38] p-4 text-sm lg:grid-cols-6">
            <span className="font-semibold">{event.eventName}</span>
            <span className="text-[#9E9880]">{event.lemonObjectId || "-"}</span>
            <span className={event.processingError ? "text-red-300" : "text-emerald-300"}>{event.processingError || "ok"}</span>
            <span className="text-[#9E9880]">{event.user?.email || "-"}</span>
            <span className="text-[#9E9880]">{event.createdAt.toISOString()}</span>
            <RetryWebhookButton id={event.id} disabled={!event.processingError} />
          </div>
        ))}
      </div>
    </AdminShell>
  )
}

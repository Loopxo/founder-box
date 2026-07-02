import { redirect } from "next/navigation"
import AdminShell from "@/components/admin/AdminShell"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded border border-[#2A2A38] bg-[#18181F] p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9E9880]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#EDE9DC]">{value}</p>
    </div>
  )
}

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!isAdmin(user)) redirect("/dashboard")

  const [users, workspaces, activeSubscriptions, toolRuns, webhookErrors, openFlags] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.subscription.count({ where: { status: { in: ["active", "on_trial", "past_due"] } } }),
    prisma.toolRun.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    prisma.lemonSqueezyEvent.count({ where: { processingError: { not: null } } }),
    prisma.suspiciousUsageFlag.count({ where: { status: "open" } }),
  ])

  return (
    <AdminShell>
      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Users" value={users} />
        <Card label="Workspaces" value={workspaces} />
        <Card label="Active Subscriptions" value={activeSubscriptions} />
        <Card label="Tool Runs 24h" value={toolRuns} />
        <Card label="Webhook Errors" value={webhookErrors} />
        <Card label="Open Flags" value={openFlags} />
      </div>
    </AdminShell>
  )
}

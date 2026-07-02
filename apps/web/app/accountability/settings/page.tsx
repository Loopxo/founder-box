import DashboardLayout from "@/components/DashboardLayout"
import SettingsForm from "@/components/accountability/SettingsForm"
import { ensureWorkspaceForUser, getUserPlan } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AccountabilitySettingsPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const [workspace, plan, notifications] = await Promise.all([
    ensureWorkspaceForUser(user),
    getUserPlan(user.id),
    prisma.notificationPreference.findUnique({ where: { userId: user.id } }),
  ])

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Workspace</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Settings</h1>
      </div>
      <div className="rounded border border-[#2A2A38] bg-[#18181F] p-5">
        <dl className="grid gap-4 text-sm lg:grid-cols-2">
          <div>
            <dt className="text-[#9E9880]">Workspace</dt>
            <dd className="mt-1 font-semibold text-[#EDE9DC]">{workspace.name}</dd>
          </div>
          <div>
            <dt className="text-[#9E9880]">Plan</dt>
            <dd className="mt-1 font-semibold text-[#EDE9DC]">{plan === "founding-pro" ? "Founding Pro" : "Free"}</dd>
          </div>
          <div>
            <dt className="text-[#9E9880]">Email</dt>
            <dd className="mt-1 font-semibold text-[#EDE9DC]">{user.email}</dd>
          </div>
          <div>
            <dt className="text-[#9E9880]">Persona</dt>
            <dd className="mt-1 font-semibold text-[#EDE9DC]">{workspace.persona || "Solo operator"}</dd>
          </div>
        </dl>
      </div>
      <SettingsForm
        workspaceName={workspace.name}
        persona={workspace.persona}
        dailyReminder={notifications?.dailyReminder}
        weeklyReview={notifications?.weeklyReview}
        reminderTime={notifications?.reminderTime}
        timezone={notifications?.timezone}
      />
    </DashboardLayout>
  )
}

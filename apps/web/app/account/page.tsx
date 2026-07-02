import DashboardLayout from "@/components/DashboardLayout"
import AccountDangerZone from "@/components/account/AccountDangerZone"
import { getCurrentSession, getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const current = await getCurrentSession()
  const [oauthAccounts, sessions] = await Promise.all([
    prisma.oAuthAccount.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    prisma.session.findMany({ where: { userId: user.id }, orderBy: { lastSeenAt: "desc" }, take: 20 }),
  ])

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Account</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">{user.email}</h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded border border-[#2A2A38] bg-[#18181F] p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">Linked Sign-ins</h2>
          {oauthAccounts.length ? (
            oauthAccounts.map((account) => (
              <div key={account.id} className="border-t border-[#2A2A38] py-3 text-sm text-[#9E9880]">
                {account.provider} · {account.email || user.email}
              </div>
            ))
          ) : (
            <p className="text-sm text-[#9E9880]">Email OTP only.</p>
          )}
        </section>

        <section className="rounded border border-[#2A2A38] bg-[#18181F] p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">Sessions</h2>
          {sessions.map((session) => (
            <div key={session.id} className="border-t border-[#2A2A38] py-3 text-sm">
              <p className="text-[#EDE9DC]">{session.id === current?.id ? "Current session" : "Session"}</p>
              <p className="text-[#9E9880]">{session.userAgent || "Unknown device"}</p>
              <p className="text-xs text-[#9E9880]">{session.revokedAt ? "Revoked" : `Last seen ${session.lastSeenAt.toISOString()}`}</p>
            </div>
          ))}
        </section>
      </div>

      <div className="mt-5">
        <AccountDangerZone email={user.email} />
      </div>
    </DashboardLayout>
  )
}

import { Flame, Inbox } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"
import QuickLogPanel from "@/components/accountability/QuickLogPanel"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"
import { BarChart } from "@/components/ui/charts"
import { getActivitySeries, getTodaySnapshot, getUserPlan } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function TodayPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const [today, plan] = await Promise.all([getTodaySnapshot(user), getUserPlan(user.id)])
  if (!today.workspace.persona) redirect("/onboarding")
  const { series, streak } = await getActivitySeries(today.workspace.id, 14)
  const bestMethod = today.metrics.methods[0]
  const chartData = series.slice(-7).map((d) => ({ label: d.label, value: d.count }))

  return (
    <DashboardLayout>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="studio-label mb-1.5">Accountability OS</p>
          <h1 className="text-2xl font-bold text-[#EDE9DC]">Today</h1>
          <p className="mt-1 text-sm text-[#9E9880]">Revenue Attempts + Shipped Outputs</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-[#18181F] px-4 py-2.5">
          <Flame className={streak > 0 ? "h-5 w-5 text-[#D4A853]" : "h-5 w-5 text-[#68634F]"} />
          <div>
            <p className="text-lg font-extrabold leading-none text-[#EDE9DC]">{streak}</p>
            <p className="text-[11px] uppercase tracking-[0.08em] text-[#9E9880]">day streak</p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Revenue Attempts" value={today.metrics.revenueAttempts.total} accent />
        <StatCard label="Shipped Outputs" value={today.metrics.shippedOutputs.total} />
        <StatCard label="Deep Work" value={`${Math.round(today.metrics.deepWorkMinutes / 60)}h`} hint={`${today.metrics.deepWorkMinutes}m total`} />
        <StatCard label="Best Method" value={bestMethod?.method || "None"} />
        <StatCard label="Plan" value={plan === "founding-pro" ? "Pro" : "Free"} />
      </div>

      <div className="mb-6 rounded-lg border border-border bg-[#18181F] p-5">
        <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">Last 7 days</h2>
        <BarChart data={chartData} />
      </div>

      <QuickLogPanel />

      <div className="mt-6 rounded-lg border border-border bg-[#18181F] p-5">
        <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">Today Feed</h2>
        {today.entries.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nothing logged yet today"
            description="Log your first outreach, work session, or proof above. Every entry builds your streak."
          />
        ) : (
          <div className="space-y-3">
            {today.entries.map((entry) => (
              <div key={entry.id} className="flex items-start justify-between gap-4 border-t border-border pt-3 first:border-t-0 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-[#EDE9DC]">{entry.title || entry.object.name}</p>
                  <p className="text-xs text-[#9E9880]">{entry.systemType || entry.object.name}</p>
                </div>
                <p className="text-xs text-[#9E9880]">{entry.happenedAt.toISOString().slice(11, 16)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

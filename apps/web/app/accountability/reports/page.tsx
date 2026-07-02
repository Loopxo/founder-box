import { FileText } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"
import ShareReportButton from "@/components/accountability/ShareReportButton"
import { StatCard } from "@/components/ui/stat-card"
import { EmptyState } from "@/components/ui/empty-state"
import { BarChart } from "@/components/ui/charts"
import { ensureWorkspaceForUser, getActivitySeries, getWeeklySnapshot } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const EXPORT_FORMATS = ["markdown", "csv", "xlsx", "pdf", "json"]

export default async function ReportsPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const [week, workspace] = await Promise.all([getWeeklySnapshot(user), ensureWorkspaceForUser(user)])
  const [shareLinks, { series }] = await Promise.all([
    prisma.shareLink.findMany({ where: { workspaceId: workspace.id }, orderBy: { createdAt: "desc" }, take: 10 }),
    getActivitySeries(workspace.id, 7),
  ])
  const chartData = series.map((d) => ({ label: d.label, value: d.count }))

  return (
    <DashboardLayout>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="studio-label mb-1.5">Weekly Proof</p>
          <h1 className="text-2xl font-bold text-[#EDE9DC]">Reports</h1>
          <p className="mt-1 text-sm text-[#9E9880]">Week of {week.weekStart.toISOString().slice(0, 10)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {EXPORT_FORMATS.map((format) => (
            <a
              key={format}
              href={`/api/accountability/export/${format}`}
              className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-[#EDE9DC] transition-colors hover:border-[#3A3830] hover:text-[#D4A853]"
            >
              {format.toUpperCase()}
            </a>
          ))}
          <ShareReportButton />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Revenue Attempts" value={week.metrics.revenueAttempts.total} accent />
        <StatCard label="Shipped Outputs" value={week.metrics.shippedOutputs.total} />
        <StatCard label="Deep Work" value={`${Math.round(week.metrics.deepWorkMinutes / 60)}h`} />
        <StatCard label="Active Days" value={`${series.filter((d) => d.count > 0).length}/7`} />
      </div>

      <div className="mb-6 rounded-lg border border-border bg-[#18181F] p-5">
        <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">This week&apos;s activity</h2>
        <BarChart data={chartData} />
      </div>

      <div className="mb-6 rounded-lg border border-border bg-[#18181F] p-5">
        <h2 className="mb-4 text-sm font-semibold text-[#EDE9DC]">Weekly report</h2>
        <pre className="whitespace-pre-wrap text-sm leading-7 text-[#C9C3B0]">{week.markdown}</pre>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#EDE9DC]">Shared reports</h2>
        {shareLinks.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No shared reports yet"
            description="Generate a share link from your weekly report to send proof to clients, investors, or your accountability partner."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-[#18181F]">
            {shareLinks.map((link) => (
              <div key={link.id} className="grid items-center gap-3 border-b border-border p-4 text-sm last:border-b-0 lg:grid-cols-5">
                <span className="font-semibold text-[#EDE9DC]">{link.title}</span>
                <span className="text-[#9E9880]">{link.redacted ? "Redacted" : "Full"}</span>
                <span className={link.revokedAt ? "text-[#C0514A]" : "text-[#4D9E6A]"}>{link.revokedAt ? "Revoked" : "Active"}</span>
                <span className="text-[#9E9880]">{link.viewCount} views</span>
                <a className="font-semibold text-[#D4A853] hover:underline" href={`/share/${link.token}`}>Open →</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

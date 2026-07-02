import { FlaskConical } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"
import { calculateMethodStats } from "@founderbox/core"
import { EmptyState } from "@/components/ui/empty-state"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function MethodsPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const workspace = await ensureWorkspaceForUser(user)
  const entries = await prisma.entry.findMany({
    where: { workspaceId: workspace.id, systemType: "outreach", archivedAt: null },
    orderBy: { happenedAt: "desc" },
  })
  const methods = calculateMethodStats(entries)

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Experiments</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Methods</h1>
        <p className="mt-1 text-sm text-[#9E9880]">Which outreach methods actually convert.</p>
      </div>
      {methods.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No method data yet"
          description="Log outreach with different methods to see which ones produce replies and closes."
        />
      ) : (
        <div className="space-y-3">
          {methods.map((method) => {
            const winPct = Math.round(method.winRate * 100)
            return (
              <div key={method.method} className="rounded-lg border border-border bg-[#18181F] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-semibold text-[#EDE9DC]">{method.method}</span>
                  <span className="text-sm font-bold text-[#D4A853]">{winPct}% win rate</span>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#1E1E28]">
                  <div className="h-full rounded-full bg-[#D4A853]" style={{ width: `${Math.min(100, winPct)}%` }} />
                </div>
                <div className="flex gap-6 text-xs text-[#9E9880]">
                  <span>Used <strong className="text-[#EDE9DC]">{method.usedCount}</strong></span>
                  <span>Replies <strong className="text-[#EDE9DC]">{method.replyCount}</strong></span>
                  <span>Closed <strong className="text-[#EDE9DC]">{method.closeCount}</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}

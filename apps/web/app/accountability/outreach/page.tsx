import DashboardLayout from "@/components/DashboardLayout"
import OutreachImportForm from "@/components/accountability/OutreachImportForm"
import { EntryList, type EntryRow } from "@/components/accountability/EntryList"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function OutreachPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const workspace = await ensureWorkspaceForUser(user)
  const entries = await prisma.entry.findMany({
    where: { workspaceId: workspace.id, systemType: "outreach", archivedAt: null },
    orderBy: { happenedAt: "desc" },
    take: 100,
  })

  const rows: EntryRow[] = entries.map((entry) => {
    const data = entry.data as Record<string, unknown> | null
    return {
      id: entry.id,
      title: entry.title || "Outreach",
      timestamp: entry.happenedAt.toISOString().slice(0, 10),
      meta: [
        { label: "Method", value: String(data?.method_used || "No method") },
        { label: "Outcome", value: String(data?.outcome || "Sent") },
      ],
    }
  })

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Revenue Attempts</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Outreach</h1>
      </div>
      <div className="mb-5">
        <OutreachImportForm />
      </div>
      <EntryList
        initialEntries={rows}
        emptyTitle="No outreach logged yet"
        emptyDescription="Log outreach from the Today page to start tracking your revenue attempts."
        searchPlaceholder="Search outreach…"
      />
    </DashboardLayout>
  )
}

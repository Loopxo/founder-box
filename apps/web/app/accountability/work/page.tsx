import DashboardLayout from "@/components/DashboardLayout"
import { EntryList, type EntryRow } from "@/components/accountability/EntryList"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function WorkPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const workspace = await ensureWorkspaceForUser(user)
  const entries = await prisma.entry.findMany({
    where: { workspaceId: workspace.id, systemType: "work_session", archivedAt: null },
    include: { proofAssets: true },
    orderBy: { happenedAt: "desc" },
    take: 100,
  })

  const rows: EntryRow[] = entries.map((entry) => {
    const data = entry.data as Record<string, unknown> | null
    return {
      id: entry.id,
      title: String(data?.project || entry.title || "Work"),
      timestamp: entry.happenedAt.toISOString().slice(0, 10),
      meta: [
        { label: "Output", value: String(data?.output_created || "No output") },
        { label: "Duration", value: `${String(data?.duration_minutes || 0)} min` },
        { label: "Proof", value: `${entry.proofAssets.length} proof` },
      ],
    }
  })

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Shipped Outputs</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Work Sessions</h1>
      </div>
      <EntryList
        initialEntries={rows}
        emptyTitle="No work sessions logged yet"
        emptyDescription="Every work block needs an output or proof link. Log one from the Today page."
        searchPlaceholder="Search work sessions…"
      />
    </DashboardLayout>
  )
}

import DashboardLayout from "@/components/DashboardLayout"
import { EntryList, type EntryRow } from "@/components/accountability/EntryList"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function ProductsPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const workspace = await ensureWorkspaceForUser(user)
  const entries = await prisma.entry.findMany({
    where: { workspaceId: workspace.id, systemType: "product_progress", archivedAt: null },
    include: { proofAssets: true },
    orderBy: { happenedAt: "desc" },
    take: 100,
  })

  const rows: EntryRow[] = entries.map((entry) => {
    const data = entry.data as Record<string, unknown> | null
    return {
      id: entry.id,
      title: String(data?.product || entry.title || "Product"),
      timestamp: entry.happenedAt.toISOString().slice(0, 10),
      meta: [
        { label: "Feature", value: String(data?.feature_worked_on || "Progress") },
        { label: "Stage", value: String(data?.stage || "Building") },
        { label: "Next", value: String(data?.next_action || "No next action") },
      ],
    }
  })

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Product Progress</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Products</h1>
      </div>
      <EntryList
        initialEntries={rows}
        emptyTitle="No product progress logged yet"
        emptyDescription="Track features, stages, and proof links from the Today page."
        searchPlaceholder="Search products…"
      />
    </DashboardLayout>
  )
}

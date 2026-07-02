import DashboardLayout from "@/components/DashboardLayout"
import QuickLeadForm from "@/components/accountability/QuickLeadForm"
import { EntryList, type EntryRow } from "@/components/accountability/EntryList"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function LeadsPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const workspace = await ensureWorkspaceForUser(user)
  const leads = await prisma.entry.findMany({
    where: { workspaceId: workspace.id, systemType: "lead", archivedAt: null },
    orderBy: { updatedAt: "desc" },
    take: 250,
  })

  const rows: EntryRow[] = leads.map((lead) => {
    const data = lead.data as Record<string, unknown> | null
    return {
      id: lead.id,
      title: String(data?.client_name || lead.title || "Lead"),
      timestamp: String(data?.next_follow_up_date || "No follow-up"),
      meta: [
        { label: "Type", value: String(data?.business_type || "Business") },
        { label: "Status", value: String(data?.status || "New") },
        { label: "Value", value: data?.potential_value ? `$${Number(data.potential_value).toLocaleString()}` : "-" },
      ],
    }
  })

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Pipeline</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Leads</h1>
        <p className="mt-2 text-sm text-[#9E9880]">Track who you are trying to turn into revenue.</p>
      </div>
      <div className="mb-5">
        <QuickLeadForm />
      </div>
      <EntryList
        initialEntries={rows}
        emptyTitle="No leads yet"
        emptyDescription="Add leads above to start building your revenue pipeline."
        searchPlaceholder="Search leads…"
      />
    </DashboardLayout>
  )
}


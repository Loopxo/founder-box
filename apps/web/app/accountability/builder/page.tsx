import { ACCOUNTABILITY_FLOW_TEMPLATES } from "@founderbox/core"
import DashboardLayout from "@/components/DashboardLayout"
import BuilderControls from "@/components/accountability/BuilderControls"
import { ensureWorkspaceForUser, getUserPlan } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export default async function BuilderPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const [workspace, plan] = await Promise.all([ensureWorkspaceForUser(user), getUserPlan(user.id)])
  const flows = await prisma.flow.findMany({
    where: { workspaceId: workspace.id, archivedAt: null },
    include: { objects: { include: { fields: { orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "asc" },
  })
  const canCreateFlow = plan === "founding-pro" || flows.length === 0

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Custom Flows</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Builder</h1>
        <p className="mt-2 text-sm text-[#9E9880]">Create, import, duplicate, archive, and inspect the objects that power your accountability workspace.</p>
      </div>
      <BuilderControls
        canCreateFlow={canCreateFlow}
        flows={flows.map((flow) => ({ id: flow.id, name: flow.name }))}
        templates={ACCOUNTABILITY_FLOW_TEMPLATES.map((template) => ({ key: template.key, name: template.name, persona: template.persona }))}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {flows.map((flow) => (
          <div key={flow.id} className="rounded border border-[#2A2A38] bg-[#18181F] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#EDE9DC]">{flow.name}</h2>
                <p className="text-sm text-[#9E9880]">{flow.persona || "custom operator"}</p>
              </div>
              <span className="rounded border border-[#2A2A38] px-2 py-1 text-xs text-[#9E9880]">v{flow.currentVersion} / {flow.objects.length} objects</span>
            </div>
            <div className="space-y-3">
              {flow.objects.map((object) => (
                <div key={object.id} className="rounded border border-[#2A2A38] p-3">
                  <p className="text-sm font-semibold text-[#EDE9DC]">{object.name}</p>
                  <p className="mt-1 text-xs text-[#9E9880]">{object.fields.length} fields</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {object.fields.slice(0, 8).map((field) => (
                      <span key={field.id} className="rounded border border-[#2A2A38] px-2 py-1 text-[11px] text-[#9E9880]">{field.name} / {field.type}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

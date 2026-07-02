import DashboardLayout from "@/components/DashboardLayout"
import BillingActions from "@/components/accountability/BillingActions"
import { getUserPlan } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"

export default async function BillingPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const plan = await getUserPlan(user.id)

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Billing</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">{plan === "founding-pro" ? "Founding Pro" : "Free"}</h1>
        <p className="mt-2 text-sm text-[#9E9880]">Lemon Squeezy is the billing source of truth.</p>
      </div>
      <div className="rounded border border-[#2A2A38] bg-[#18181F] p-5">
        <BillingActions />
      </div>
    </DashboardLayout>
  )
}

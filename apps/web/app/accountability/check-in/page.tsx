import DashboardLayout from "@/components/DashboardLayout"
import CheckInForm from "@/components/accountability/CheckInForm"
import { getTodaySnapshot } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"

export default async function CheckInPage() {
  const user = await getCurrentUser()
  if (!user) return null
  const today = await getTodaySnapshot(user)

  return (
    <DashboardLayout>
      <div className="mb-7">
        <p className="studio-label mb-2">Daily Check-in</p>
        <h1 className="text-2xl font-bold text-[#EDE9DC]">Start the day</h1>
      </div>
      <CheckInForm />
      {today.review && (
        <div className="mt-5 rounded border border-[#2A2A38] bg-[#18181F] p-5">
          <p className="text-sm font-semibold text-[#EDE9DC]">Current main goal</p>
          <p className="mt-2 text-sm text-[#9E9880]">{today.review.mainGoal || "No main goal set."}</p>
        </div>
      )}
    </DashboardLayout>
  )
}

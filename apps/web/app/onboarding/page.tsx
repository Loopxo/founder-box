import { Suspense } from "react"
import { redirect } from "next/navigation"
import OnboardingWizard from "@/components/onboarding/OnboardingWizard"
import { getCurrentUser } from "@/lib/auth"

export default async function OnboardingPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111118] px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-7 text-center">
          <p className="studio-label mb-1.5">FounderBox</p>
          <h1 className="text-2xl font-bold text-[#EDE9DC]">Welcome to FounderBox</h1>
          <p className="mt-1.5 text-sm text-[#9E9880]">
            Let&apos;s set up your accountability OS in three quick steps.
          </p>
        </div>
        <Suspense fallback={<div className="rounded-lg border border-border bg-[#18181F] p-6 text-center text-[#9E9880]">Loading...</div>}>
          <OnboardingWizard />
        </Suspense>
      </div>
    </main>
  )
}

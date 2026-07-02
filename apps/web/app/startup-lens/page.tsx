import type { Metadata } from "next"
import DashboardLayout from "@/components/DashboardLayout"
import StartupLensWorkspace from "@/components/StartupLensWorkspace"

export const metadata: Metadata = {
  title: "Startup Lens",
  description:
    "A layered startup research tracker for studying founder DNA, problem anatomy, business model, scaling decisions, and market context.",
}

export default function StartupLensPage() {
  return (
    <DashboardLayout>
      <StartupLensWorkspace />
    </DashboardLayout>
  )
}

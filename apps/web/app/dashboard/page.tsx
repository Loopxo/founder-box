import Link from "next/link"
import { redirect } from "next/navigation"
import DashboardLayout from "@/components/DashboardLayout"
import { StatCard } from "@/components/ui/stat-card"
import { getActivitySeries, getTodaySnapshot, getUserPlan } from "@/lib/accountability"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface Tool {
  title: string
  description: string
  href: string
  tag: string
  isNew?: boolean
}

const TOOLS: Tool[] = [
  { title: "Startup Lens", description: "A layered startup research tracker with PDF export.", href: "/startup-lens", tag: "Research", isNew: true },
  { title: "Proposal Generator", description: "Craft client-ready proposals in minutes.", href: "/dashboard/proposal", tag: "Writing" },
  { title: "Launchpath Atlas", description: "A guided founder curriculum with curated resources.", href: "/founder-guide", tag: "Guide" },
  { title: "Cold Emails", description: "High-converting outreach at scale.", href: "/cold-emails", tag: "Outreach" },
  { title: "Contracts", description: "Legal-grade agreements, ready to send.", href: "/contract", tag: "Legal" },
  { title: "Invoices", description: "Professional invoices with one click.", href: "/invoice", tag: "Finance" },
  { title: "SEO Content", description: "Content engineered to rank and convert.", href: "/seo", tag: "Content" },
  { title: "Sales Copy", description: "Persuasive copy that drives revenue.", href: "/sales", tag: "Marketing" },
  { title: "Social Media", description: "Scroll-stopping content for every platform.", href: "/social-media-content", tag: "Social" },
  { title: "Competitive Analysis", description: "Know your market. Stay ahead.", href: "/competitive-analysis", tag: "Research" },
  { title: "Resume Forge", description: "100% ATS-friendly founder resumes.", href: "/resume", tag: "Career" },
]

const ACCOUNTABILITY = [
  { title: "Today", description: "Log outreach, work sessions, product progress, and proof.", href: "/accountability/today", tag: "Proof" },
  { title: "Outreach", description: "Track method, message, offer, reply, and close outcome.", href: "/accountability/outreach", tag: "Revenue" },
  { title: "Work Sessions", description: "Every work block needs an output or proof link.", href: "/accountability/work", tag: "Output" },
  { title: "Reports", description: "Weekly accountability reports with share links.", href: "/accountability/reports", tag: "Review" },
]

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const [today, plan] = await Promise.all([getTodaySnapshot(user), getUserPlan(user.id)])
  if (!today.workspace.persona) redirect("/onboarding")

  const [{ streak }, apiKeyCount] = await Promise.all([
    getActivitySeries(today.workspace.id, 14),
    prisma.apiKey.count({ where: { userId: user.id, revokedAt: null } }),
  ])

  const stats = [
    { label: "Today", value: `${today.metrics.revenueAttempts.total + today.metrics.shippedOutputs.total} logged`, accent: true },
    { label: "Streak", value: `${streak} ${streak === 1 ? "day" : "days"}` },
    { label: "MCP Keys", value: apiKeyCount > 0 ? `${apiKeyCount} active` : "None" },
    { label: "Plan", value: plan === "founding-pro" ? "Founding Pro" : "Free" },
  ]

  return (
    <DashboardLayout>
      <div className="mb-9">
        <p className="studio-label mb-1.5">Overview</p>
        <h1 className="text-2xl font-bold leading-tight text-[#EDE9DC]">Welcome back, {user.name || user.email.split("@")[0]}</h1>
        <p className="mt-1.5 text-sm text-[#9E9880]">Your solo-operator accountability OS, with founder tools and MCP access.</p>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} />
        ))}
      </div>

      <section className="mb-12">
        <p className="studio-label mb-4">Accountability OS</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACCOUNTABILITY.map((tool) => (
            <Link key={tool.href} href={tool.href} className="studio-card studio-card-hover block p-5">
              <span className="rounded border border-[#D4A853]/30 bg-[#D4A853]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#D4A853]">
                {tool.tag}
              </span>
              <p className="mt-3.5 text-[15px] font-semibold text-[#EDE9DC]">{tool.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#9E9880]">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="studio-label mb-4">Founder Tools</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="studio-card studio-card-hover block p-5">
              <div className="flex items-start justify-between">
                <span className="rounded border border-border bg-[#1E1E28] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9E9880]">
                  {tool.tag}
                </span>
                {tool.isNew && (
                  <span className="rounded border border-[#D4A853]/30 bg-[#D4A853]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#D4A853]">
                    New
                  </span>
                )}
              </div>
              <p className="mt-3 text-[15px] font-semibold text-[#EDE9DC]">{tool.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#9E9880]">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-12 border-t border-border pt-6">
        <p className="text-xs text-[#9E9880]">
          FounderBox — built by{" "}
          <a href="https://loopxo.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#D4A853] hover:underline">
            LoopXo
          </a>
        </p>
      </div>
    </DashboardLayout>
  )
}

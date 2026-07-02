import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser, getUserPlan } from "@/lib/accountability"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function planStatus(plan: string) {
  return { plan, label: plan === "founding-pro" ? "Founding Pro" : "Free", isPro: plan === "founding-pro" }
}

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const [workspace, plan, notifications] = await Promise.all([
    ensureWorkspaceForUser(user),
    getUserPlan(user.id),
    prisma.notificationPreference.findUnique({ where: { userId: user.id } }),
  ])

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    workspace: { id: workspace.id, name: workspace.name, slug: workspace.slug, persona: workspace.persona },
    plan: planStatus(plan),
    notifications,
  })
}

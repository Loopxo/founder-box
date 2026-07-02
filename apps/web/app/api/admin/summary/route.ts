import { NextResponse } from "next/server"
import { requireAdminUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const { user, response } = await requireAdminUser()
  if (!user) return response

  const [users, workspaces, toolRuns24h, failedToolRuns24h, openFlags, webhookErrors] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.toolRun.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    prisma.toolRun.count({ where: { status: "error", createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    prisma.suspiciousUsageFlag.count({ where: { status: "open" } }),
    prisma.lemonSqueezyEvent.count({ where: { processingError: { not: null } } }),
  ])

  return NextResponse.json({ users, workspaces, toolRuns24h, failedToolRuns24h, openFlags, webhookErrors })
}

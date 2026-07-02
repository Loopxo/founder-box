import { NextRequest, NextResponse } from "next/server"
import { ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const [updatedWorkspace, notifications] = await Promise.all([
    prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        name: typeof body.workspaceName === "string" && body.workspaceName.trim() ? body.workspaceName.trim() : undefined,
        persona: typeof body.persona === "string" && body.persona.trim() ? body.persona.trim() : undefined,
      },
    }),
    prisma.notificationPreference.upsert({
      where: { userId: user.id },
      update: {
        dailyReminder: Boolean(body.dailyReminder),
        weeklyReview: body.weeklyReview == null ? true : Boolean(body.weeklyReview),
        reminderTime: typeof body.reminderTime === "string" ? body.reminderTime : undefined,
        timezone: typeof body.timezone === "string" ? body.timezone : undefined,
      },
      create: {
        userId: user.id,
        dailyReminder: Boolean(body.dailyReminder),
        weeklyReview: body.weeklyReview == null ? true : Boolean(body.weeklyReview),
        reminderTime: typeof body.reminderTime === "string" ? body.reminderTime : undefined,
        timezone: typeof body.timezone === "string" ? body.timezone : undefined,
      },
    }),
  ])

  await writeAuditEvent({ action: "workspace.settings.updated", userId: user.id, workspaceId: workspace.id, request })
  return NextResponse.json({ workspace: updatedWorkspace, notifications })
}


import { NextRequest, NextResponse } from "next/server"
import { createAccountabilityEntry, ensureWorkspaceForUser } from "@/lib/accountability"
import { writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const workspace = await ensureWorkspaceForUser(user)
  const leads = await prisma.entry.findMany({
    where: { workspaceId: workspace.id, systemType: "lead", archivedAt: null },
    orderBy: { updatedAt: "desc" },
    take: 250,
  })
  return NextResponse.json({ leads })
}

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const workspace = await ensureWorkspaceForUser(user)
  const entry = await createAccountabilityEntry({
    workspaceId: workspace.id,
    userId: user.id,
    objectKey: "leads",
    systemType: "lead",
    title: body.clientName || "Lead",
    summary: body.notes,
    values: {
      client_name: body.clientName,
      business_type: body.businessType,
      country: body.country,
      source: body.source || "Other",
      status: body.status || "New",
      potential_value: body.potentialValue == null ? undefined : Number(body.potentialValue),
      next_follow_up_date: body.nextFollowUpDate,
      notes: body.notes,
    },
  })

  await writeAuditEvent({ action: "lead.created", userId: user.id, workspaceId: workspace.id, entityType: "Entry", entityId: entry.id, request })
  return NextResponse.json({ entry })
}


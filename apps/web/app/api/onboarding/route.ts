import { NextRequest, NextResponse } from "next/server"
import { requireCurrentUser } from "@/lib/auth"
import { ensureWorkspaceForUser, installFlowTemplate } from "@/lib/accountability"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const body = await request.json().catch(() => ({}))
  const persona = typeof body.persona === "string" ? body.persona.trim() : ""
  const templateKey = typeof body.templateKey === "string" ? body.templateKey.trim() : ""

  if (!persona) {
    return NextResponse.json({ error: "Persona is required." }, { status: 400 })
  }

  const workspace = await ensureWorkspaceForUser(user)

  try {
    if (templateKey) {
      const entryCount = await prisma.entry.count({ where: { workspaceId: workspace.id } })
      if (entryCount === 0) {
        await prisma.flow.updateMany({
          where: { workspaceId: workspace.id, archivedAt: null },
          data: { archivedAt: new Date(), isActive: false },
        })
        await installFlowTemplate(workspace.id, templateKey)
      }
    }

    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { persona },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Onboarding failed." },
      { status: 400 }
    )
  }
}

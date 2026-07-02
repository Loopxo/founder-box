import { NextRequest, NextResponse } from "next/server"
import { writeAuditEvent } from "@/lib/audit"
import { requireAdminUser } from "@/lib/auth"
import { processLemonSqueezyWebhook } from "@/lib/billing"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { user, response } = await requireAdminUser(request)
  if (!user) return response

  const { id } = await context.params
  const event = await prisma.lemonSqueezyEvent.findUnique({ where: { id } })
  if (!event) return NextResponse.json({ error: "Webhook event not found." }, { status: 404 })

  await prisma.lemonSqueezyEvent.update({ where: { id }, data: { processedAt: null, processingError: null } })
  const result = await processLemonSqueezyWebhook(JSON.stringify(event.payload))
  await writeAuditEvent({ action: "admin.webhook.retried", userId: user.id, entityType: "LemonSqueezyEvent", entityId: id, request })
  return NextResponse.json({ ok: true, processed: result.processed })
}


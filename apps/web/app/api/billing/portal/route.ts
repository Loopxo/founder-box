import { NextRequest, NextResponse } from "next/server"
import { getCustomerPortalUrl } from "@/lib/billing"
import { requireCurrentUser } from "@/lib/auth"
import { writeAuditEvent } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const url = await getCustomerPortalUrl(user.id)
  await writeAuditEvent({ action: "billing.portal.opened", userId: user.id, request })
  return NextResponse.json({ url })
}

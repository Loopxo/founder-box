import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { requestMeta, writeAuditEvent } from "@/lib/audit"
import { requireCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { enforceApiRateLimit, payloadTooLargeResponse, readJsonBody } from "@/lib/security"

export async function POST(request: NextRequest) {
  const { user, response } = await requireCurrentUser(request)
  if (!user) return response

  const meta = requestMeta(request)
  const rateLimitResponse = await enforceApiRateLimit({ ip: meta.ipAddress, scope: "mobile:push:register", limit: 30 })
  if (rateLimitResponse) return rateLimitResponse

  let body: Record<string, unknown>
  try {
    body = await readJsonBody(request)
  } catch (error) {
    return payloadTooLargeResponse(error) || NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const expoPushToken = typeof body.expoPushToken === "string" ? body.expoPushToken.trim() : ""
  if (!expoPushToken.startsWith("ExponentPushToken[")) return NextResponse.json({ error: "Valid Expo push token is required." }, { status: 400 })

  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: {
      channelPreferences: {
        mobile: {
          expoPushToken,
          platform: typeof body.platform === "string" ? body.platform : undefined,
          deviceName: typeof body.deviceName === "string" ? body.deviceName : undefined,
          timezone: typeof body.timezone === "string" ? body.timezone : undefined,
          registeredAt: new Date().toISOString(),
        },
      } as Prisma.InputJsonValue,
    },
    create: {
      userId: user.id,
      dailyReminder: true,
      weeklyReview: true,
      timezone: typeof body.timezone === "string" ? body.timezone : undefined,
      channelPreferences: {
        mobile: {
          expoPushToken,
          platform: typeof body.platform === "string" ? body.platform : undefined,
          deviceName: typeof body.deviceName === "string" ? body.deviceName : undefined,
          timezone: typeof body.timezone === "string" ? body.timezone : undefined,
          registeredAt: new Date().toISOString(),
        },
      } as Prisma.InputJsonValue,
    },
  })

  await writeAuditEvent({ action: "mobile.push.registered", userId: user.id, metadata: { platform: body.platform }, request })
  return NextResponse.json({ ok: true })
}

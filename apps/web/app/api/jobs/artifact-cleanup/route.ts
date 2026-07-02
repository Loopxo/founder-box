import { NextRequest, NextResponse } from "next/server"
import { writeAuditEvent } from "@/lib/audit"
import { prisma } from "@/lib/prisma"

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) return process.env.NODE_ENV !== "production"
  return request.headers.get("x-founderbox-cron-secret") === secret
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized." }, { status: 401 })

  const now = new Date()
  const [artifacts, exportJobs, rateBuckets] = await Promise.all([
    prisma.artifact.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.exportJob.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.rateLimitBucket.deleteMany({ where: { resetAt: { lt: now } } }),
  ])

  await prisma.shareLink.updateMany({
    where: { expiresAt: { lt: now }, revokedAt: null },
    data: { revokedAt: now },
  })

  await writeAuditEvent({
    action: "job.artifact_cleanup.completed",
    metadata: { artifacts: artifacts.count, exportJobs: exportJobs.count, rateBuckets: rateBuckets.count },
    request,
  })

  return NextResponse.json({ ok: true, deleted: { artifacts: artifacts.count, exportJobs: exportJobs.count, rateBuckets: rateBuckets.count } })
}

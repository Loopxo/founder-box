import { NextResponse } from "next/server"
import { logServerEvent } from "@/lib/logger"
import { isObjectStorageConfigured } from "@/lib/storage"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const startedAt = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({
      ok: true,
      service: "founderbox-web",
      database: "ok",
      storage: isObjectStorageConfigured() ? "configured" : "not_configured",
      durationMs: Date.now() - startedAt,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Health check failed."
    await logServerEvent("error", "FounderBox health check failed", { check: "database", error: message })
    return NextResponse.json(
      {
        ok: false,
        service: "founderbox-web",
        database: "error",
        storage: isObjectStorageConfigured() ? "configured" : "not_configured",
        error: message,
        durationMs: Date.now() - startedAt,
      },
      { status: 503 },
    )
  }
}

import { Prisma } from "@prisma/client"
import { prisma } from "./prisma"

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

export async function recordFlowVersion(flowId: string, action: string, metadata: Record<string, unknown> = {}) {
  const flow = await prisma.flow.findUnique({
    where: { id: flowId },
    select: { currentVersion: true },
  })
  if (!flow) return null

  const version = flow.currentVersion + 1
  await prisma.$transaction([
    prisma.flow.update({ where: { id: flowId }, data: { currentVersion: version } }),
    prisma.flowVersion.create({
      data: {
        flowId,
        version,
        config: json({ action, metadata, recordedAt: new Date().toISOString() }),
      },
    }),
  ])
  return version
}


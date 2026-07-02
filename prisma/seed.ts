import { PrismaClient } from "@prisma/client"
import { createApiKey, hashSecret } from "@founderbox/core"

const prisma = new PrismaClient()

function apiKeySecret() {
  return process.env.API_KEY_HASH_SECRET || process.env.SESSION_SECRET || "founderbox-dev-api-key-secret"
}

async function main() {
  await prisma.plan.upsert({
    where: { slug: "free" },
    update: {
      limits: { workspaces: 1, activeFlows: 1, historyDays: 30, shareReportsPerMonth: 3, accountabilityMcpCallsPerDay: 50 },
    },
    create: {
      slug: "free",
      name: "Free",
      priceCents: 0,
      limits: { workspaces: 1, activeFlows: 1, historyDays: 30, shareReportsPerMonth: 3, accountabilityMcpCallsPerDay: 50 },
    },
  })

  await prisma.plan.upsert({
    where: { slug: "founding-pro" },
    update: {
      priceCents: Number(process.env.FOUNDERBOX_PRO_PRICE_USD || 8) * 100,
      limits: { workspaces: 1, activeFlows: "unlimited", historyDays: "unlimited", shareReportsPerMonth: "unlimited", accountabilityMcpCallsPerDay: 1000 },
    },
    create: {
      slug: "founding-pro",
      name: "Founding Pro",
      priceCents: Number(process.env.FOUNDERBOX_PRO_PRICE_USD || 8) * 100,
      limits: { workspaces: 1, activeFlows: "unlimited", historyDays: "unlimited", shareReportsPerMonth: "unlimited", accountabilityMcpCallsPerDay: 1000 },
    },
  })

  const adminEmail = process.env.FOUNDERBOX_ADMIN_EMAIL
  if (adminEmail) {
    const user = await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { role: "admin" },
      create: { email: adminEmail.toLowerCase(), role: "admin", name: "FounderBox Admin" },
    })
    const existingWorkspace = await prisma.workspaceMember.findFirst({ where: { userId: user.id } })
    if (!existingWorkspace) {
      const workspace = await prisma.workspace.create({
        data: {
          name: "FounderBox Admin Workspace",
          ownerUserId: user.id,
          members: { create: { userId: user.id, role: "owner" } },
        },
      })
      await prisma.auditEvent.create({ data: { action: "seed.admin_workspace.created", userId: user.id, workspaceId: workspace.id } })
    }
    if (process.env.FOUNDERBOX_SEED_ADMIN_API_KEY === "true") {
      const key = createApiKey()
      await prisma.apiKey.create({
        data: { userId: user.id, name: "Seed admin key", prefix: key.slice(0, 12), keyHash: hashSecret(key, apiKeySecret()) },
      })
      console.log(`Seed admin API key: ${key}`)
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })

import crypto from "node:crypto"
import { Prisma } from "@prisma/client"
import { ensureDefaultPlans } from "./accountability"
import { prisma } from "./prisma"

type LemonPayload = {
  meta?: {
    event_id?: string
    event_name?: string
    custom_data?: Record<string, unknown>
  }
  data?: {
    id?: string
    type?: string
    attributes?: Record<string, unknown>
  }
}

function json(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue
}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not configured.`)
  return value
}

function webUrl() {
  return process.env.FOUNDERBOX_WEB_URL || "http://localhost:3000"
}

async function lemonFetch(path: string, init: RequestInit = {}) {
  const response = await fetch(`https://api.lemonsqueezy.com/v1${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${requiredEnv("LEMONSQUEEZY_API_KEY")}`,
      ...(init.headers || {}),
    },
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    const detail = typeof json === "object" && json && "errors" in json ? JSON.stringify(json.errors) : response.statusText
    throw new Error(`Lemon Squeezy API failed: ${detail}`)
  }
  return json as { data?: { attributes?: Record<string, unknown> } }
}

export async function createCheckoutUrl(input: { userId: string; workspaceId?: string; email: string; name?: string | null }) {
  const storeId = requiredEnv("LEMONSQUEEZY_STORE_ID")
  const variantId = process.env.LEMONSQUEEZY_FOUNDING_PRO_VARIANT_ID || requiredEnv("LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID")
  const checkout = await lemonFetch("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            enabled_variants: [Number(variantId)],
            redirect_url: `${webUrl()}/billing?checkout=success`,
          },
          checkout_options: {
            embed: false,
            media: false,
            logo: true,
            discount: true,
            button_color: "#D4A853",
          },
          checkout_data: {
            email: input.email,
            name: input.name || undefined,
            custom: {
              user_id: input.userId,
              workspace_id: input.workspaceId,
              plan: "founding-pro",
            },
          },
          test_mode: process.env.NODE_ENV !== "production",
        },
        relationships: {
          store: { data: { type: "stores", id: String(storeId) } },
          variant: { data: { type: "variants", id: String(variantId) } },
        },
      },
    }),
  })

  const url = checkout.data?.attributes?.url
  if (typeof url !== "string") throw new Error("Lemon Squeezy did not return a checkout URL.")
  return url
}

export async function getCustomerPortalUrl(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: { in: ["active", "on_trial", "past_due"] } },
    orderBy: { updatedAt: "desc" },
  })

  if (subscription?.lemonSubscriptionId && process.env.LEMONSQUEEZY_API_KEY) {
    const response = await lemonFetch(`/subscriptions/${subscription.lemonSubscriptionId}`)
    const portalUrl = response.data?.attributes?.urls
    if (portalUrl && typeof portalUrl === "object" && "customer_portal" in portalUrl && typeof portalUrl.customer_portal === "string") {
      await prisma.subscription.update({ where: { id: subscription.id }, data: { customerPortalUrl: portalUrl.customer_portal } })
      return portalUrl.customer_portal
    }
  }

  if (subscription?.customerPortalUrl) return subscription.customerPortalUrl
  if (process.env.LEMONSQUEEZY_STORE_BILLING_URL) return process.env.LEMONSQUEEZY_STORE_BILLING_URL
  throw new Error("No active Lemon Squeezy subscription was found.")
}

export function verifyLemonSqueezySignature(rawBody: string, signatureHeader: string | null) {
  const secret = requiredEnv("LEMONSQUEEZY_WEBHOOK_SECRET")
  const signature = Buffer.from(signatureHeader || "", "hex")
  const expected = Buffer.from(crypto.createHmac("sha256", secret).update(rawBody).digest("hex"), "hex")
  return signature.length === expected.length && crypto.timingSafeEqual(signature, expected)
}

function asString(value: unknown) {
  if (value == null) return undefined
  return String(value)
}

function asDate(value: unknown) {
  const text = asString(value)
  if (!text) return undefined
  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function eventDigest(rawBody: string) {
  return crypto.createHash("sha256").update(rawBody).digest("hex")
}

export async function processLemonSqueezyWebhook(rawBody: string) {
  const payload = JSON.parse(rawBody) as LemonPayload
  const eventName = payload.meta?.event_name || "unknown"
  const attributes = payload.data?.attributes || {}
  const custom = payload.meta?.custom_data || {}
  const lemonObjectId = payload.data?.id
  const eventId = payload.meta?.event_id || eventDigest(rawBody)

  const stored = await prisma.lemonSqueezyEvent.upsert({
    where: { eventId },
    update: {},
    create: {
      eventId,
      eventName,
      lemonObjectId,
      payload: json(payload),
      userId: asString(custom.user_id),
    },
  })

  if (stored.processedAt) return { event: stored, processed: false }

  try {
    if (eventName.startsWith("subscription_")) {
      await ensureDefaultPlans()
      const userId = asString(custom.user_id)
      const email = asString(attributes.user_email)
      const user = userId
        ? await prisma.user.findUnique({ where: { id: userId } })
        : email
          ? await prisma.user.upsert({ where: { email }, update: {}, create: { email, name: asString(attributes.user_name) } })
          : null

      if (!user) throw new Error("Subscription webhook did not include a known user.")

      const workspaceId = asString(custom.workspace_id)
      const foundingPlan = await prisma.plan.findUnique({ where: { slug: "founding-pro" } })
      const urls = attributes.urls
      const customerPortalUrl = urls && typeof urls === "object" && "customer_portal" in urls ? asString(urls.customer_portal) : undefined

      await prisma.subscription.upsert({
        where: { lemonSubscriptionId: String(lemonObjectId) },
        update: {
          userId: user.id,
          workspaceId,
          planId: foundingPlan?.id,
          lemonCustomerId: asString(attributes.customer_id),
          lemonOrderId: asString(attributes.order_id),
          lemonProductId: asString(attributes.product_id),
          lemonVariantId: asString(attributes.variant_id),
          status: asString(attributes.status) || "unknown",
          renewsAt: asDate(attributes.renews_at),
          endsAt: asDate(attributes.ends_at),
          trialEndsAt: asDate(attributes.trial_ends_at),
          currentPeriodEnd: asDate(attributes.renews_at) || asDate(attributes.ends_at),
          customerPortalUrl,
          raw: json(attributes),
        },
        create: {
          userId: user.id,
          workspaceId,
          planId: foundingPlan?.id,
          lemonSubscriptionId: String(lemonObjectId),
          lemonCustomerId: asString(attributes.customer_id),
          lemonOrderId: asString(attributes.order_id),
          lemonProductId: asString(attributes.product_id),
          lemonVariantId: asString(attributes.variant_id),
          status: asString(attributes.status) || "unknown",
          renewsAt: asDate(attributes.renews_at),
          endsAt: asDate(attributes.ends_at),
          trialEndsAt: asDate(attributes.trial_ends_at),
          currentPeriodEnd: asDate(attributes.renews_at) || asDate(attributes.ends_at),
          customerPortalUrl,
          raw: json(attributes),
        },
      })
    }

    const event = await prisma.lemonSqueezyEvent.update({ where: { id: stored.id }, data: { processedAt: new Date(), processingError: null } })
    return { event, processed: true }
  } catch (error) {
    await prisma.lemonSqueezyEvent.update({
      where: { id: stored.id },
      data: { processingError: error instanceof Error ? error.message : "Unknown webhook processing error." },
    })
    throw error
  }
}

export async function trackServerEvent(input: {
  event: string
  userId?: string | null
  workspaceId?: string | null
  properties?: Record<string, unknown>
}) {
  const key = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
  if (!key) return

  try {
    await fetch(`${host.replace(/\/$/, "")}/capture/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: key,
        event: input.event,
        distinct_id: input.userId || "anonymous",
        properties: {
          workspaceId: input.workspaceId,
          ...input.properties,
        },
      }),
    })
  } catch {
    // Analytics must never block product workflows.
  }
}


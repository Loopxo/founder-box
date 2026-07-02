export async function logServerEvent(level: "info" | "warn" | "error", message: string, metadata: Record<string, unknown> = {}) {
  const payload = {
    level,
    message,
    service: "founderbox-web",
    timestamp: new Date().toISOString(),
    ...metadata,
  }

  if (level === "error") console.error(JSON.stringify(payload))
  else if (level === "warn") console.warn(JSON.stringify(payload))
  else console.log(JSON.stringify(payload))

  const token = process.env.BETTER_STACK_SOURCE_TOKEN
  if (!token) return

  try {
    await fetch("https://in.logs.betterstack.com/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // Remote logging must never block application work.
  }
}


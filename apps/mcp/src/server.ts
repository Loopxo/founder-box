import { Readable } from "node:stream"
import type { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { createMcpExpressApp } from "@modelcontextprotocol/express"
import { McpServer, WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server"
import { authenticateBearer } from "./auth.js"
import { requestContext } from "./context.js"
import { prisma } from "./db.js"
import { registerFounderBoxTools } from "./tools.js"

function allowedOrigins() {
  return new Set(
    [
      process.env.FOUNDERBOX_WEB_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      ...(process.env.FOUNDERBOX_ALLOWED_ORIGINS || "").split(","),
    ]
      .filter(Boolean)
      .map((origin) => origin!.trim()),
  )
}

function isOriginAllowed(origin: string | undefined) {
  if (!origin) return true
  const allowed = allowedOrigins()
  return allowed.has("*") || allowed.has(origin)
}

function objectStorageConfigured() {
  return Boolean(process.env.S3_ENDPOINT && process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)
}

function toWebRequest(req: ExpressRequest) {
  const protocol = req.protocol || "http"
  const host = req.get("host") || `localhost:${process.env.PORT || 8787}`
  const url = `${protocol}://${host}${req.originalUrl}`
  const headers = new Headers()

  Object.entries(req.headers).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(key, item))
    } else if (value !== undefined) {
      headers.set(key, value)
    }
  })

  const hasBody = !["GET", "HEAD"].includes(req.method.toUpperCase())
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
  })
}

function sendWebResponse(response: Response, res: ExpressResponse) {
  res.status(response.status)
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })

  if (!response.body) {
    res.end()
    return
  }

  Readable.fromWeb(response.body as never).pipe(res)
}

async function main() {
  const configuredAllowedHosts = (process.env.FOUNDERBOX_ALLOWED_HOSTS || "").split(",").filter(Boolean)
  const app = createMcpExpressApp({
    host: "0.0.0.0",
    jsonLimit: "4mb",
    allowedHosts: configuredAllowedHosts.length ? configuredAllowedHosts : undefined,
  })

  const server = new McpServer({ name: "founderbox", version: "0.1.0" })
  registerFounderBoxTools(server)

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  })
  await server.connect(transport)

  app.get("/health", async (_req, res) => {
    const checks: Record<string, "ok" | "not_configured" | "error"> = {
      db: "ok",
      storage: objectStorageConfigured() ? "ok" : "not_configured",
    }

    try {
      await prisma.$queryRaw`SELECT 1`
    } catch {
      checks.db = "error"
    }

    const ok = Object.values(checks).every((value) => value === "ok" || value === "not_configured")
    res.status(ok ? 200 : 503).json({
      ok,
      name: "founderbox-mcp",
      checks,
      timestamp: new Date().toISOString(),
    })
  })

  app.options("/mcp", (_req, res) => {
    res.setHeader("access-control-allow-origin", process.env.FOUNDERBOX_WEB_URL || "*")
    res.setHeader("access-control-allow-headers", "content-type, authorization, mcp-protocol-version, mcp-session-id")
    res.setHeader("access-control-allow-methods", "GET,POST,DELETE,OPTIONS")
    res.status(204).end()
  })

  app.all("/mcp", async (req, res) => {
    if (!isOriginAllowed(req.get("origin"))) {
      res.status(403).json({ error: "Origin is not allowed for FounderBox MCP." })
      return
    }

    const principal = await authenticateBearer(req.get("authorization"))
    if (!principal) {
      await prisma.suspiciousUsageFlag.create({
        data: {
          type: "failed_api_key_attempt",
          reason: "MCP request rejected because the API key was missing or invalid.",
          severity: "medium",
          metadata: {
            origin: req.get("origin"),
            userAgent: req.get("user-agent"),
            hasAuthorization: Boolean(req.get("authorization")),
          },
        },
      })
      res.status(401).json({ error: "Unauthorized. Provide Authorization: Bearer fb_live_xxxxx." })
      return
    }

    await requestContext.run(principal, async () => {
      const webResponse = await transport.handleRequest(toWebRequest(req), {
        parsedBody: req.body,
      })
      sendWebResponse(webResponse, res)
    })
  })

  const port = Number(process.env.PORT || 8787)
  app.listen(port, () => {
    console.log(`FounderBox MCP listening on http://localhost:${port}/mcp`)
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

import { AsyncLocalStorage } from "node:async_hooks"

export interface McpRequestContext {
  userId?: string
  apiKeyId?: string
  email?: string
  plan: "hosted-free" | "founding-pro" | "self-host" | "dev"
}

export const requestContext = new AsyncLocalStorage<McpRequestContext>()

export function getRequestContext() {
  return requestContext.getStore()
}

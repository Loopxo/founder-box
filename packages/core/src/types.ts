export type ArtifactType = "pdf" | "html" | "markdown" | "json"

export interface FounderBoxArtifact {
  id: string
  name: string
  type: ArtifactType
  mimeType: string
  url?: string
  expiresAt?: string
}

export interface FounderBoxToolResult<T> {
  status: "ok" | "error"
  data?: T
  artifacts?: FounderBoxArtifact[]
  meta: {
    tool: string
    version: string
    runId: string
  }
  error?: {
    code: string
    message: string
  }
}

export function okResult<T>(tool: string, runId: string, data: T, artifacts?: FounderBoxArtifact[]): FounderBoxToolResult<T> {
  return {
    status: "ok",
    data,
    artifacts,
    meta: { tool, version: "0.1.0", runId },
  }
}

export function errorResult(tool: string, runId: string, code: string, message: string): FounderBoxToolResult<never> {
  return {
    status: "error",
    meta: { tool, version: "0.1.0", runId },
    error: { code, message },
  }
}


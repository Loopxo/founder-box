import { FounderBoxClient } from "@founderbox/api-client"
import { FOUNDERBOX_API_URL } from "./env"

export function createFounderBoxClient(getAccessToken?: () => string | null | Promise<string | null>) {
  return new FounderBoxClient({
    baseUrl: FOUNDERBOX_API_URL,
    getAccessToken,
  })
}

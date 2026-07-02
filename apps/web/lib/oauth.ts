import { prisma } from "./prisma"

export type OAuthProvider = "google" | "github"

export function isOAuthProvider(value: string): value is OAuthProvider {
  return value === "google" || value === "github"
}

function appUrl() {
  return process.env.FOUNDERBOX_WEB_URL || "http://localhost:3000"
}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not configured.`)
  return value
}

export function oauthRedirectUrl(provider: OAuthProvider) {
  return `${appUrl()}/api/auth/oauth/${provider}/callback`
}

export function buildOAuthAuthorizeUrl(provider: OAuthProvider, state: string) {
  if (provider === "google") {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    url.searchParams.set("client_id", requiredEnv("GOOGLE_CLIENT_ID"))
    url.searchParams.set("redirect_uri", oauthRedirectUrl("google"))
    url.searchParams.set("response_type", "code")
    url.searchParams.set("scope", "openid email profile")
    url.searchParams.set("state", state)
    url.searchParams.set("prompt", "select_account")
    return url
  }

  const url = new URL("https://github.com/login/oauth/authorize")
  url.searchParams.set("client_id", requiredEnv("GITHUB_CLIENT_ID"))
  url.searchParams.set("redirect_uri", oauthRedirectUrl("github"))
  url.searchParams.set("scope", "read:user user:email")
  url.searchParams.set("state", state)
  return url
}

async function postForm(url: string, body: Record<string, string>) {
  const response = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`OAuth token exchange failed: ${JSON.stringify(data)}`)
  return data as Record<string, unknown>
}

async function getJson(url: string, token: string) {
  const response = await fetch(url, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` } })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`OAuth profile fetch failed: ${JSON.stringify(data)}`)
  return data
}

export async function exchangeOAuthCode(provider: OAuthProvider, code: string) {
  if (provider === "google") {
    const token = await postForm("https://oauth2.googleapis.com/token", {
      client_id: requiredEnv("GOOGLE_CLIENT_ID"),
      client_secret: requiredEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: oauthRedirectUrl("google"),
      grant_type: "authorization_code",
      code,
    })
    const accessToken = String(token.access_token || "")
    const profile = (await getJson("https://www.googleapis.com/oauth2/v3/userinfo", accessToken)) as Record<string, unknown>
    const email = String(profile.email || "")
    if (!email || profile.email_verified === false) throw new Error("Google account email is not verified.")

    return {
      provider,
      providerAccountId: String(profile.sub),
      email,
      name: typeof profile.name === "string" ? profile.name : undefined,
      avatarUrl: typeof profile.picture === "string" ? profile.picture : undefined,
      accessToken,
      refreshToken: typeof token.refresh_token === "string" ? token.refresh_token : undefined,
      expiresAt: typeof token.expires_in === "number" ? new Date(Date.now() + token.expires_in * 1000) : undefined,
    }
  }

  const token = await postForm("https://github.com/login/oauth/access_token", {
    client_id: requiredEnv("GITHUB_CLIENT_ID"),
    client_secret: requiredEnv("GITHUB_CLIENT_SECRET"),
    redirect_uri: oauthRedirectUrl("github"),
    code,
  })
  const accessToken = String(token.access_token || "")
  const [profile, emails] = await Promise.all([
    getJson("https://api.github.com/user", accessToken) as Promise<Record<string, unknown>>,
    getJson("https://api.github.com/user/emails", accessToken) as Promise<Array<Record<string, unknown>>>,
  ])
  const primaryEmail = emails.find((email) => email.primary && email.verified) || emails.find((email) => email.verified)
  const email = String(primaryEmail?.email || profile.email || "")
  if (!email) throw new Error("GitHub account does not expose a verified email.")

  return {
    provider,
    providerAccountId: String(profile.id),
    email,
    name: typeof profile.name === "string" ? profile.name : typeof profile.login === "string" ? profile.login : undefined,
    avatarUrl: typeof profile.avatar_url === "string" ? profile.avatar_url : undefined,
    accessToken,
  }
}

export async function linkOAuthAccount(profile: Awaited<ReturnType<typeof exchangeOAuthCode>>) {
  const existingOAuth = await prisma.oAuthAccount.findUnique({
    where: { provider_providerAccountId: { provider: profile.provider, providerAccountId: profile.providerAccountId } },
    include: { user: true },
  })
  if (existingOAuth) return existingOAuth.user

  const user = await prisma.user.upsert({
    where: { email: profile.email },
    update: { name: profile.name },
    create: { email: profile.email, name: profile.name },
  })

  await prisma.oAuthAccount.create({
    data: {
      userId: user.id,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      accessToken: profile.accessToken,
      refreshToken: profile.refreshToken,
      expiresAt: profile.expiresAt,
    },
  })

  return user
}

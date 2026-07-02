import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"
import * as SecureStore from "expo-secure-store"
import * as Haptics from "expo-haptics"
import { FounderBoxApiError, type FounderBoxClient, type FounderBoxPlanStatus, type FounderBoxUser, type FounderBoxWorkspace } from "@founderbox/api-client"
import { createFounderBoxClient } from "./api"

const TOKEN_KEY = "founderbox.accessToken"

interface SessionContextValue {
  token: string | null
  user: FounderBoxUser | null
  workspace: FounderBoxWorkspace | null
  plan: FounderBoxPlanStatus | null
  loading: boolean
  client: FounderBoxClient
  requestOtp: (email: string) => Promise<{ devCode?: string }>
  verifyOtp: (email: string, code: string) => Promise<void>
  refreshMe: () => Promise<void>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

function readableError(error: unknown) {
  if (error instanceof FounderBoxApiError) return error.body.error
  if (error instanceof Error) return error.message
  return "Something went wrong."
}

export { readableError }

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<FounderBoxUser | null>(null)
  const [workspace, setWorkspace] = useState<FounderBoxWorkspace | null>(null)
  const [plan, setPlan] = useState<FounderBoxPlanStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const client = useMemo(() => createFounderBoxClient(() => token), [token])

  const applySession = useCallback((next: { user: FounderBoxUser; workspace: FounderBoxWorkspace; plan: FounderBoxPlanStatus }) => {
    setUser(next.user)
    setWorkspace(next.workspace)
    setPlan(next.plan)
  }, [])

  const loadMe = useCallback(async () => {
    if (!token) return
    const me = await client.me()
    applySession(me)
  }, [applySession, client, token])

  useEffect(() => {
    let mounted = true
    async function bootstrap() {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY)
        if (!mounted) return
        if (stored) setToken(stored)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void bootstrap()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!token) return
    void loadMe().catch(() => {
      void SecureStore.deleteItemAsync(TOKEN_KEY)
      setToken(null)
      setUser(null)
      setWorkspace(null)
      setPlan(null)
    })
  }, [loadMe, token])

  const value = useMemo<SessionContextValue>(() => ({
    token,
    user,
    workspace,
    plan,
    loading,
    client,
    async requestOtp(email) {
      const response = await client.requestOtp(email)
      return { devCode: response.devCode }
    },
    async verifyOtp(email, code) {
      const response = await client.verifyOtp(email, code)
      await SecureStore.setItemAsync(TOKEN_KEY, response.accessToken)
      setToken(response.accessToken)
      applySession(response)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    },
    async refreshMe() {
      await loadMe()
    },
    async logout() {
      try {
        await client.logout()
      } finally {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        setToken(null)
        setUser(null)
        setWorkspace(null)
        setPlan(null)
      }
    },
  }), [applySession, client, loadMe, loading, plan, token, user, workspace])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error("useSession must be used inside SessionProvider")
  return context
}

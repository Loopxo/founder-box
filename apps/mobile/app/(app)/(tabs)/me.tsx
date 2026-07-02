import { useCallback, useEffect, useState } from "react"
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native"
import * as Linking from "expo-linking"
import { KeyRound, LogOut, ShieldCheck } from "lucide-react-native"
import { Card, Header, GhostButton, MetricCard, PrimaryButton, Screen } from "@/components"
import { readableError, useSession } from "@/auth"
import { colors, spacing, typography } from "@/theme"

function display(value: unknown) {
  if (value == null) return ""
  return String(value)
}

export default function MeScreen() {
  const { user, workspace, plan, client, logout } = useSession()
  const [refreshing, setRefreshing] = useState(false)
  const [apiKeys, setApiKeys] = useState<Array<Record<string, unknown>>>([])
  const [sessions, setSessions] = useState<Array<Record<string, unknown>>>([])
  const [newKey, setNewKey] = useState("")
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    const [keyResponse, sessionResponse] = await Promise.all([client.apiKeys(), client.sessions()])
    setApiKeys(keyResponse.keys)
    setSessions(sessionResponse.sessions)
  }, [client])

  useEffect(() => {
    void load().catch(() => {
      // Account controls stay secondary; Today remains usable if one of these endpoints is unavailable.
    })
  }, [load])

  async function refresh() {
    setRefreshing(true)
    await load().catch((err) => Alert.alert("Refresh failed", readableError(err)))
    setRefreshing(false)
  }

  async function createKey() {
    setLoading(true)
    try {
      const response = await client.createApiKey("Mobile-created AI key")
      setNewKey(response.key)
      await load()
      Alert.alert("API key created", "It is shown once below.")
    } catch (err) {
      Alert.alert("Could not create key", readableError(err))
    } finally {
      setLoading(false)
    }
  }

  async function openCheckout() {
    setLoading(true)
    try {
      const response = await client.checkout()
      await Linking.openURL(response.url)
    } catch (err) {
      Alert.alert("Checkout unavailable", readableError(err))
    } finally {
      setLoading(false)
    }
  }

  async function revokeOtherSessions() {
    setLoading(true)
    try {
      await client.revokeOtherSessions()
      await load()
      Alert.alert("Sessions revoked", "Other devices have been logged out.")
    } catch (err) {
      Alert.alert("Could not revoke sessions", readableError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Header title="Me" right={<LogOut color={colors.muted} onPress={() => void logout()} size={26} />} />
      <ScrollView
        contentContainerStyle={{ gap: spacing.lg, padding: spacing.xl, paddingTop: spacing.sm }}
        refreshControl={<RefreshControl tintColor={colors.primary} refreshing={refreshing} onRefresh={refresh} />}
      >
        <Card style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center", backgroundColor: colors.surfaceRaised, borderRadius: 48, height: 96, justifyContent: "center", width: 96 }}>
            <Text style={{ color: colors.text, fontSize: 34, fontWeight: "900" }}>{user?.email?.[0]?.toUpperCase() || "F"}</Text>
          </View>
          <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900", marginTop: spacing.lg }}>{user?.name || "Founder"}</Text>
          <Text style={{ color: colors.muted, marginTop: spacing.xs }}>{user?.email}</Text>
        </Card>

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard label="Plan" value={plan?.isPro ? "Pro" : "Free"} accent={colors.gold} />
          <MetricCard label="Workspace" value={workspace?.persona || "Solo"} accent={colors.primary} />
        </View>

        <Card>
          <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Founding Pro</Text>
          <Text style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23, marginTop: spacing.sm }}>
            Mobile honors the same entitlement as web. Lemon Squeezy Pro unlocks mobile Pro; RevenueCat can be added for App Store purchases.
          </Text>
          <View style={{ marginTop: spacing.lg }}>
            <PrimaryButton title={plan?.isPro ? "Manage Billing" : "Upgrade to $8 Pro"} loading={loading} onPress={() => void openCheckout()} />
          </View>
        </Card>

        <Card>
          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md }}>
            <KeyRound color={colors.primary} size={24} />
            <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>MCP + API Keys</Text>
          </View>
          <Text style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23, marginTop: spacing.sm }}>
            Connect Claude, Cursor, Codex, Windsurf, or any MCP client with your FounderBox key.
          </Text>
          <View style={{ backgroundColor: colors.background, borderRadius: 16, marginTop: spacing.lg, padding: spacing.md }}>
            <Text selectable style={{ color: colors.text, fontFamily: "Courier", fontSize: 12 }}>
              {"claude mcp add founderbox --transport http https://mcp.founderbox.loopxo.org/mcp --header \"Authorization: Bearer fb_live_xxxxx\""}
            </Text>
          </View>
          {newKey ? (
            <View style={{ backgroundColor: colors.primarySoft, borderRadius: 16, marginTop: spacing.md, padding: spacing.md }}>
              <Text style={{ color: colors.primary, fontWeight: "900" }}>Copy once</Text>
              <Text selectable style={{ color: colors.text, fontFamily: "Courier", fontSize: 12, marginTop: spacing.xs }}>{newKey}</Text>
            </View>
          ) : null}
          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <PrimaryButton title="Create API Key" loading={loading} onPress={() => void createKey()} />
            {apiKeys.map((key) => (
              <View key={display(key.id)} style={{ borderTopColor: colors.border, borderTopWidth: 1, paddingTop: spacing.md }}>
                <Text style={{ color: colors.text, fontWeight: "900" }}>{display(key.name) || "AI key"}</Text>
                <Text style={{ color: colors.muted, marginTop: spacing.xs }}>{display(key.prefix)}...</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md }}>
            <ShieldCheck color={colors.success} size={24} />
            <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Sessions</Text>
          </View>
          <Text style={{ color: colors.muted, marginTop: spacing.sm }}>{sessions.length || 1} active or historical session{sessions.length === 1 ? "" : "s"}.</Text>
          <View style={{ marginTop: spacing.lg }}>
            <GhostButton title="Log out other devices" onPress={() => void revokeOtherSessions()} />
          </View>
        </Card>

        <GhostButton title="Log out" onPress={() => void logout()} />
      </ScrollView>
    </Screen>
  )
}

import { useCallback, useEffect, useMemo, useState } from "react"
import { Alert, RefreshControl, ScrollView, Share, Text, View } from "react-native"
import { CalendarCheck2, Share2 } from "lucide-react-native"
import { type WeeklySnapshot } from "@founderbox/api-client"
import { Card, Header, MetricCard, PrimaryButton, Screen } from "@/components"
import { readableError, useSession } from "@/auth"
import { FOUNDERBOX_API_URL } from "@/env"
import { registerPushDevice, scheduleDailyProofReminder } from "@/notifications"
import { colors, formatMinutes, spacing, typography } from "@/theme"

const days = ["M", "T", "W", "T", "F", "S", "S"]

function dateKey(value: unknown) {
  if (!value) return ""
  return new Date(String(value)).toISOString().slice(0, 10)
}

export default function DailyScreen() {
  const { client } = useSession()
  const [week, setWeek] = useState<WeeklySnapshot | null>(null)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [sharing, setSharing] = useState(false)

  const load = useCallback(async () => {
    setError("")
    try {
      setWeek(await client.week())
    } catch (err) {
      setError(readableError(err))
    }
  }, [client])

  useEffect(() => {
    void load()
  }, [load])

  async function refresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  async function createShareReport() {
    setSharing(true)
    try {
      const response = await client.createShareLink({ title: "FounderBox weekly proof", redacted: true, weekStart: week?.weekStart })
      const url = response.url.startsWith("http") ? response.url : `${FOUNDERBOX_API_URL}${response.url}`
      await Share.share({ message: `My FounderBox weekly proof report: ${url}`, url })
    } catch (err) {
      Alert.alert("Could not create report", readableError(err))
    } finally {
      setSharing(false)
    }
  }

  async function enableReminder() {
    const id = await scheduleDailyProofReminder(20, 30)
    await registerPushDevice(client).catch(() => false)
    Alert.alert(id ? "Reminder enabled" : "Permission needed", id ? "FounderBox will remind you at 8:30 PM." : "Enable notifications to use mobile reminders.")
  }

  const reviewedDays = useMemo(() => new Set((week?.dailyReviews || []).map((review) => dateKey(review.date))), [week])
  const weekStart = week ? new Date(week.weekStart) : new Date()

  return (
    <Screen>
      <Header eyebrow="Proof Calendar" title="Daily" />
      <ScrollView
        contentContainerStyle={{ gap: spacing.lg, padding: spacing.xl, paddingTop: spacing.sm }}
        refreshControl={<RefreshControl tintColor={colors.primary} refreshing={refreshing} onRefresh={refresh} />}
      >
        <Card>
          <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Check-in Record</Text>
          <Text style={{ color: colors.muted, fontSize: typography.body, marginTop: spacing.xs }}>Start and close days with proof, not vibes.</Text>
          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl }}>
            {days.map((day, index) => {
              const current = new Date(weekStart)
              current.setUTCDate(weekStart.getUTCDate() + index)
              const active = reviewedDays.has(current.toISOString().slice(0, 10))
              return (
                <View key={`${day}-${index}`} style={{ alignItems: "center", flex: 1 }}>
                  <Text style={{ color: colors.muted, fontWeight: "800" }}>{day}</Text>
                  <View style={{ alignItems: "center", backgroundColor: active ? colors.amber : colors.surfaceRaised, borderRadius: 18, height: 36, justifyContent: "center", marginTop: spacing.sm, width: 36 }}>
                    {active ? <CalendarCheck2 color={colors.background} size={18} /> : null}
                  </View>
                </View>
              )
            })}
          </View>
        </Card>

        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard label="Attempts" value={week?.metrics.revenueAttempts ?? 0} accent={colors.primary} />
          <MetricCard label="Outputs" value={week?.metrics.shippedOutputs ?? 0} accent={colors.gold} />
        </View>
        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <MetricCard label="Deep Work" value={formatMinutes(week?.metrics.deepWorkMinutes ?? 0)} accent={colors.success} />
          <MetricCard label="Entries" value={week?.entries.length ?? 0} accent={colors.amber} />
        </View>

        <Card>
          <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Weekly Review</Text>
          <Text numberOfLines={8} style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23, marginTop: spacing.sm }}>
            {week?.markdown || "Your shareable proof report will live here after you log a few entries."}
          </Text>
          <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
            <PrimaryButton title="Create Share Report" loading={sharing} onPress={() => void createShareReport()} />
            <PrimaryButton title="Enable 8:30 PM Reminder" onPress={() => void enableReminder()} />
          </View>
          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm, justifyContent: "center", marginTop: spacing.md }}>
            <Share2 color={colors.primary} size={16} />
            <Text style={{ color: colors.muted }}>Reports are private until you create a link.</Text>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  )
}

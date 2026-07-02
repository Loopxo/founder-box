import { useState } from "react"
import { Alert, Pressable, ScrollView, Text, View } from "react-native"
import { router } from "expo-router"
import { Card, Field, Header, PrimaryButton, Screen } from "@/components"
import { readableError, useSession } from "@/auth"
import { registerPushDevice, scheduleDailyProofReminder } from "@/notifications"
import { colors, spacing, typography } from "@/theme"

const personas = [
  { key: "Solo Dev", title: "Solo Dev", body: "Ship product progress, commits, fixes, and deep work blocks." },
  { key: "Indie Hacker", title: "Indie Hacker", body: "Track experiments, launches, distribution, and revenue signals." },
  { key: "Agency Owner", title: "Agency Owner", body: "Watch outreach methods, proposals, delivery, and closes." },
  { key: "Freelancer", title: "Freelancer", body: "Keep client work, invoices, output proof, and follow-ups clean." },
]

export default function OnboardingScreen() {
  const { client, workspace, refreshMe } = useSession()
  const [persona, setPersona] = useState(workspace?.persona || "Solo Dev")
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || "My FounderBox")
  const [reminders, setReminders] = useState(true)
  const [loading, setLoading] = useState(false)

  async function finish() {
    setLoading(true)
    try {
      await client.updateAccountabilitySettings({
        workspaceName,
        persona,
        dailyReminder: reminders,
        weeklyReview: true,
        reminderTime: "20:30",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      if (reminders) {
        await scheduleDailyProofReminder(20, 30)
        await registerPushDevice(client).catch(() => false)
      }
      await refreshMe()
      router.replace("/today")
    } catch (err) {
      Alert.alert("Onboarding failed", readableError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <Header eyebrow="Setup" title="FounderBox" />
      <ScrollView contentContainerStyle={{ gap: spacing.lg, padding: spacing.xl, paddingTop: spacing.sm }}>
        <Card>
          <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Choose your operating mode</Text>
          <Text style={{ color: colors.muted, lineHeight: 23, marginTop: spacing.sm }}>
            This tunes the dashboard language around what you actually need to prove each day.
          </Text>
        </Card>

        <Field placeholder="Workspace name" value={workspaceName} onChangeText={setWorkspaceName} />

        {personas.map((item) => {
          const active = persona === item.key
          return (
            <Pressable key={item.key} onPress={() => setPersona(item.key)}>
              <Card style={{ borderColor: active ? colors.primary : colors.border }}>
                <Text style={{ color: active ? colors.primary : colors.text, fontSize: typography.body, fontWeight: "900" }}>{item.title}</Text>
                <Text style={{ color: colors.muted, lineHeight: 22, marginTop: spacing.xs }}>{item.body}</Text>
              </Card>
            </Pressable>
          )
        })}

        <Pressable onPress={() => setReminders((value) => !value)}>
          <Card style={{ alignItems: "center", flexDirection: "row", gap: spacing.md }}>
            <View style={{ backgroundColor: reminders ? colors.primary : colors.surfaceRaised, borderRadius: 14, height: 28, width: 28 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>Daily proof reminder</Text>
              <Text style={{ color: colors.muted, marginTop: spacing.xs }}>8:30 PM local reminder to close the day with proof.</Text>
            </View>
          </Card>
        </Pressable>

        <PrimaryButton title="Enter FounderBox" loading={loading} onPress={() => void finish()} />
      </ScrollView>
    </Screen>
  )
}

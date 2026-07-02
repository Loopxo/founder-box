import { useCallback, useEffect, useState } from "react"
import { Alert, Pressable, RefreshControl, ScrollView, Text, View } from "react-native"
import { CheckCircle2, CopyPlus, Layers3 } from "lucide-react-native"
import { type FlowSummary } from "@founderbox/api-client"
import { Card, EmptyState, Header, PrimaryButton, Screen } from "@/components"
import { readableError, useSession } from "@/auth"
import { colors, spacing, typography } from "@/theme"

const templates = [
  { key: "solo-dev", name: "Solo Dev", body: "Work blocks, shipped outputs, commits, product progress, and end-day proof." },
  { key: "indie-hacker", name: "Indie Hacker", body: "Experiments, distribution, revenue attempts, launches, and weekly learning loops." },
  { key: "agency-owner", name: "Agency Owner", body: "Leads, outreach methods, proposals, client delivery, follow-ups, and closes." },
  { key: "freelancer", name: "Freelancer", body: "Client pipeline, paid work, deliverables, invoices, proof links, and reputation assets." },
  { key: "client-outreach-sprint", name: "Outreach Sprint", body: "Method tests, message volume, replies, calls booked, follow-up deadlines." },
  { key: "product-shipping-sprint", name: "Shipping Sprint", body: "Feature plan, work sessions, deployments, blockers, and shipped proof." },
  { key: "personal-discipline-reset", name: "Discipline Reset", body: "Daily check-ins, focus blocks, no-output warnings, and reflection." },
]

export default function CustomScreen() {
  const { client, plan } = useSession()
  const [flows, setFlows] = useState<FlowSummary[]>([])
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [installing, setInstalling] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError("")
    try {
      const response = await client.flows()
      setFlows(response.flows)
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

  async function installTemplate(templateKey: string) {
    setInstalling(templateKey)
    try {
      await client.createFlow({ templateKey })
      await load()
      Alert.alert("Template installed", "Your mobile flow builder is updated.")
    } catch (err) {
      Alert.alert("Could not install", readableError(err))
    } finally {
      setInstalling(null)
    }
  }

  return (
    <Screen>
      <Header eyebrow="Flow Builder" title="Custom" />
      <ScrollView
        contentContainerStyle={{ gap: spacing.lg, padding: spacing.xl, paddingTop: spacing.sm }}
        refreshControl={<RefreshControl tintColor={colors.primary} refreshing={refreshing} onRefresh={refresh} />}
      >
        <Card>
          <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Build your operating flow</Text>
          <Text style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23, marginTop: spacing.sm }}>
            Install founder-grade accountability flows. Free accounts keep one active flow; Pro unlocks unlimited operating systems.
          </Text>
          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm, marginTop: spacing.lg }}>
            <Layers3 color={colors.primary} size={20} />
            <Text style={{ color: colors.text, fontWeight: "900" }}>{flows.length} active flow{flows.length === 1 ? "" : "s"}</Text>
            <Text style={{ color: colors.gold, fontWeight: "900" }}>{plan?.isPro ? "Pro" : "Free"}</Text>
          </View>
        </Card>

        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}

        {flows.length > 0 ? (
          <Card>
            <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Installed</Text>
            {flows.map((flow, index) => (
              <View key={flow.id} style={{ borderTopColor: colors.border, borderTopWidth: index === 0 ? 0 : 1, paddingVertical: spacing.md }}>
                <Text style={{ color: colors.text, fontWeight: "900" }}>{flow.name}</Text>
                <Text style={{ color: colors.muted, marginTop: spacing.xs }}>{flow.description || flow.persona || flow.templateKey}</Text>
              </View>
            ))}
          </Card>
        ) : (
          <EmptyState title="No flow installed" body="Install one template to turn daily work into measurable proof." />
        )}

        <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900", marginTop: spacing.md }}>Template Gallery</Text>
        {templates.map((template) => {
          const installed = flows.some((flow) => flow.templateKey === template.key)
          return (
            <Card key={template.key}>
              <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md }}>
                <View style={{ alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 22, height: 44, justifyContent: "center", width: 44 }}>
                  {installed ? <CheckCircle2 color={colors.success} size={24} /> : <CopyPlus color={colors.primary} size={24} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: typography.body, fontWeight: "900" }}>{template.name}</Text>
                  <Text style={{ color: colors.muted, lineHeight: 21, marginTop: spacing.xs }}>{template.body}</Text>
                </View>
              </View>
              <View style={{ marginTop: spacing.lg }}>
                <PrimaryButton
                  title={installed ? "Install Again" : "Install Template"}
                  loading={installing === template.key}
                  onPress={() => void installTemplate(template.key)}
                />
              </View>
            </Card>
          )
        })}

        <Pressable onPress={() => Alert.alert("Mobile builder", "Object/field editing is next. Template install and flow listing are live now.")}>
          <Text style={{ color: colors.primary, fontWeight: "900", textAlign: "center" }}>Advanced object editor</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  )
}

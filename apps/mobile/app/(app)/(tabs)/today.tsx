import { useCallback, useEffect, useMemo, useState } from "react"
import { Alert, Modal, Pressable, RefreshControl, ScrollView, Text, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { CheckCircle2, Flame, Plus, RotateCw, TimerReset, X } from "lucide-react-native"
import { type TodaySnapshot } from "@founderbox/api-client"
import { Card, EmptyState, Field, GhostButton, Header, MetricCard, PrimaryButton, Screen } from "@/components"
import { readableError, useSession } from "@/auth"
import { flushOfflineQueue, queuedMutationCount, requestOrQueue } from "@/offline-queue"
import { scheduleWorkBlockEndReminder } from "@/notifications"
import { colors, formatMinutes, radius, spacing, typography } from "@/theme"

type QuickLogMode = "outreach" | "work" | "product" | "proof" | "checkin" | "review"

const modes: Array<{ key: QuickLogMode; label: string }> = [
  { key: "outreach", label: "Outreach" },
  { key: "work", label: "Work" },
  { key: "product", label: "Product" },
  { key: "proof", label: "Proof" },
  { key: "checkin", label: "Start" },
  { key: "review", label: "Review" },
]

const initialForm = {
  clientName: "",
  channel: "LinkedIn",
  messageUsed: "",
  methodUsed: "",
  project: "",
  outputCreated: "",
  durationMinutes: "25",
  proofLink: "",
  product: "",
  featureWorkedOn: "",
  stage: "Building",
  blocker: "",
  nextAction: "",
  proofLabel: "",
  proofText: "",
  mainGoal: "",
  mood: "",
  energy: "7",
  biggestOutput: "",
  methodWorked: "",
  vanished: "",
  endOfDayReview: "",
}

const BLOCK_STARTED_AT_KEY = "founderbox.workBlock.startedAt"

function fieldText(value: unknown) {
  if (value == null) return ""
  return String(value)
}

export default function TodayScreen() {
  const { client, workspace } = useSession()
  const [today, setToday] = useState<TodaySnapshot | null>(null)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [quickLogOpen, setQuickLogOpen] = useState(false)
  const [mode, setMode] = useState<QuickLogMode>("outreach")
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)
  const [queuedCount, setQueuedCount] = useState(0)
  const [blockStartedAt, setBlockStartedAt] = useState<Date | null>(null)

  const loadQueueCount = useCallback(async () => {
    setQueuedCount(await queuedMutationCount())
  }, [])

  const load = useCallback(async () => {
    setError("")
    try {
      setToday(await client.today())
    } catch (err) {
      setError(readableError(err))
    } finally {
      await loadQueueCount()
    }
  }, [client, loadQueueCount])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    void AsyncStorage.getItem(BLOCK_STARTED_AT_KEY).then((value) => {
      if (value) setBlockStartedAt(new Date(value))
    })
  }, [])

  async function refresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  async function syncQueue() {
    setRefreshing(true)
    try {
      const result = await flushOfflineQueue(client)
      await load()
      Alert.alert("Sync complete", `${result.synced} queued action${result.synced === 1 ? "" : "s"} synced.`)
    } catch (err) {
      Alert.alert("Sync failed", readableError(err))
    } finally {
      setRefreshing(false)
    }
  }

  function openLog(nextMode: QuickLogMode) {
    setMode(nextMode)
    setQuickLogOpen(true)
  }

  function update(field: keyof typeof initialForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submitQuickLog() {
    setSaving(true)
    try {
      const durationMinutes = Number(form.durationMinutes || 0)
      let result: { queued: boolean }

      if (mode === "outreach") {
        result = await requestOrQueue(client, "/api/accountability/outreach", {
          clientName: form.clientName,
          channel: form.channel,
          messageUsed: form.messageUsed,
          methodUsed: form.methodUsed,
          personalizationLevel: "Medium",
          offerSent: form.proofLink,
          outcome: "Sent",
          followUpRequired: true,
        })
      } else if (mode === "work") {
        result = await requestOrQueue(client, "/api/accountability/work-session", {
          project: form.project || "Focused work",
          durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 25,
          type: "Product",
          outputCreated: form.outputCreated,
          valuable: Boolean(form.outputCreated || form.proofLink),
          proofLink: form.proofLink,
        })
      } else if (mode === "product") {
        result = await requestOrQueue(client, "/api/accountability/product-progress", {
          product: form.product,
          featureWorkedOn: form.featureWorkedOn,
          stage: form.stage,
          proofLink: form.proofLink,
          blocker: form.blocker,
          nextAction: form.nextAction,
        })
      } else if (mode === "proof") {
        result = await requestOrQueue(client, "/api/accountability/proof", {
          type: "other",
          label: form.proofLabel || form.outputCreated || "Mobile proof",
          url: form.proofLink,
          text: form.proofText,
          metadata: { source: "mobile" },
        })
      } else if (mode === "checkin") {
        result = await requestOrQueue(client, "/api/accountability/check-in", {
          mood: form.mood,
          energy: Number(form.energy || 0),
          mainGoal: form.mainGoal,
        })
      } else {
        result = await requestOrQueue(client, "/api/accountability/end-day", {
          biggestOutput: form.biggestOutput,
          methodWorked: form.methodWorked,
          vanished: form.vanished,
          endOfDayReview: form.endOfDayReview,
          deepWorkMinutes: today?.metrics.deepWorkMinutes || 0,
          revenueTaskDone: Boolean(today?.metrics.revenueAttempts),
          productTaskDone: Boolean(today?.metrics.shippedOutputs),
          distributionTaskDone: Boolean(today?.metrics.revenueAttempts),
        })
      }

      setQuickLogOpen(false)
      setForm(initialForm)
      await load()
      Alert.alert(result.queued ? "Saved offline" : "Logged", result.queued ? "This will sync when the backend is reachable." : "Your proof dashboard is updated.")
    } catch (err) {
      Alert.alert("Could not log", readableError(err))
    } finally {
      setSaving(false)
    }
  }

  async function startBlock() {
    const durationMinutes = Number(form.durationMinutes || 25)
    const startedAt = new Date()
    setBlockStartedAt(startedAt)
    await AsyncStorage.setItem(BLOCK_STARTED_AT_KEY, startedAt.toISOString())
    await scheduleWorkBlockEndReminder(durationMinutes, "FounderBox block")
    Alert.alert("Work block started", `You will get a reminder in ${durationMinutes} minutes. Finish with a concrete output.`)
  }

  function finishBlock() {
    const started = blockStartedAt
    const minutes = started ? Math.max(1, Math.round((Date.now() - started.getTime()) / 60000)) : Number(form.durationMinutes || 25)
    setForm((current) => ({ ...current, durationMinutes: String(minutes), project: current.project || "Focused work" }))
    setBlockStartedAt(null)
    void AsyncStorage.removeItem(BLOCK_STARTED_AT_KEY)
    openLog("work")
  }

  const metrics = today?.metrics
  const entries = today?.entries || []
  const proofs = today?.proofAssets || today?.proofs || []
  const score = useMemo(() => (metrics?.revenueAttempts || 0) + (metrics?.shippedOutputs || 0) * 3, [metrics])

  return (
    <Screen>
      <Header
        eyebrow={workspace?.name || "FounderBox"}
        title="Today"
        right={
          <View style={{ alignItems: "center", backgroundColor: colors.surface, borderRadius: 22, height: 44, justifyContent: "center", width: 44 }}>
            <Flame color={colors.amber} size={26} />
            <Text style={{ color: colors.text, fontSize: 10, fontWeight: "900", position: "absolute" }}>{score}</Text>
          </View>
        }
      />
      <ScrollView
        contentContainerStyle={{ gap: spacing.lg, padding: spacing.xl, paddingTop: spacing.sm }}
        refreshControl={<RefreshControl tintColor={colors.primary} refreshing={refreshing} onRefresh={refresh} />}
      >
        <Card style={{ gap: spacing.lg }}>
          <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Revenue Attempts + Shipped Outputs</Text>
          <Text style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23 }}>
            Your mobile command center for proof of what actually moved today.
          </Text>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <MetricCard label="Attempts" value={metrics?.revenueAttempts ?? 0} accent={colors.primary} />
            <MetricCard label="Outputs" value={metrics?.shippedOutputs ?? 0} accent={colors.gold} />
          </View>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            <MetricCard label="Deep Work" value={formatMinutes(metrics?.deepWorkMinutes ?? 0)} accent={colors.success} />
            <MetricCard label="Proofs" value={proofs.length} accent={colors.amber} />
          </View>
        </Card>

        {queuedCount > 0 ? (
          <Card style={{ alignItems: "center", flexDirection: "row", gap: spacing.md, justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: "900" }}>{queuedCount} offline action{queuedCount === 1 ? "" : "s"}</Text>
              <Text style={{ color: colors.muted, marginTop: spacing.xs }}>Queued safely in SQLite.</Text>
            </View>
            <Pressable onPress={() => void syncQueue()} style={{ backgroundColor: colors.primarySoft, borderRadius: 22, padding: spacing.md }}>
              <RotateCw color={colors.primary} size={22} />
            </Pressable>
          </Card>
        ) : null}

        <View style={{ flexDirection: "row", gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <PrimaryButton title={blockStartedAt ? "Finish Block" : "Start Block"} onPress={blockStartedAt ? finishBlock : () => void startBlock()} />
          </View>
          <Pressable onPress={() => openLog("review")} style={{ alignItems: "center", backgroundColor: colors.surfaceRaised, borderRadius: 24, height: 60, justifyContent: "center", width: 60 }}>
            <TimerReset color={colors.text} size={24} />
          </Pressable>
          <Pressable onPress={() => openLog("outreach")} style={{ alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 24, height: 60, justifyContent: "center", width: 60 }}>
            <Plus color={colors.primary} size={26} />
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          {modes.map((item) => (
            <Pressable key={item.key} onPress={() => openLog(item.key)} style={{ backgroundColor: colors.surfaceRaised, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
              <Text style={{ color: item.key === mode ? colors.primary : colors.text, fontWeight: "800" }}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}

        {entries.length > 0 ? (
          <Card>
            <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Today Feed</Text>
            {entries.slice(0, 8).map((entry, index) => (
              <View key={String(entry.id || index)} style={{ borderTopColor: colors.border, borderTopWidth: index === 0 ? 0 : 1, paddingVertical: spacing.md }}>
                <Text style={{ color: colors.text, fontSize: typography.body, fontWeight: "800" }}>{fieldText(entry.title || entry.systemType || "Logged proof")}</Text>
                <Text numberOfLines={2} style={{ color: colors.muted, marginTop: spacing.xs }}>{fieldText(entry.summary || "No summary yet")}</Text>
              </View>
            ))}
          </Card>
        ) : (
          <EmptyState title="No proof logged yet" body="Start a work block or quick-log outreach, product progress, or proof. Empty days should feel obvious." />
        )}
      </ScrollView>

      <Modal animationType="slide" transparent visible={quickLogOpen} onRequestClose={() => setQuickLogOpen(false)}>
        <View style={{ backgroundColor: "rgba(0,0,0,0.72)", flex: 1, justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, maxHeight: "88%", padding: spacing.xl }}>
            <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.lg }}>
              <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Quick Log</Text>
              <Pressable onPress={() => setQuickLogOpen(false)} style={{ padding: spacing.sm }}>
                <X color={colors.muted} size={24} />
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, marginBottom: spacing.lg }}>
              {modes.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setMode(item.key)}
                  style={{ backgroundColor: mode === item.key ? colors.primary : colors.surfaceRaised, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}
                >
                  <Text style={{ color: colors.text, fontWeight: "900" }}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView contentContainerStyle={{ gap: spacing.md }}>
              {mode === "outreach" ? (
                <>
                  <Field placeholder="Client or lead name" value={form.clientName} onChangeText={(value) => update("clientName", value)} />
                  <Field placeholder="Channel: LinkedIn, Email, WhatsApp..." value={form.channel} onChangeText={(value) => update("channel", value)} />
                  <Field placeholder="Method used" value={form.methodUsed} onChangeText={(value) => update("methodUsed", value)} />
                  <Field placeholder="Message sent" multiline value={form.messageUsed} onChangeText={(value) => update("messageUsed", value)} />
                </>
              ) : null}

              {mode === "work" ? (
                <>
                  <Field placeholder="Project" value={form.project} onChangeText={(value) => update("project", value)} />
                  <Field placeholder="Output created" value={form.outputCreated} onChangeText={(value) => update("outputCreated", value)} />
                  <Field keyboardType="number-pad" placeholder="Duration minutes" value={form.durationMinutes} onChangeText={(value) => update("durationMinutes", value)} />
                  <Field placeholder="Proof link" value={form.proofLink} onChangeText={(value) => update("proofLink", value)} />
                </>
              ) : null}

              {mode === "product" ? (
                <>
                  <Field placeholder="Product" value={form.product} onChangeText={(value) => update("product", value)} />
                  <Field placeholder="Feature worked on" value={form.featureWorkedOn} onChangeText={(value) => update("featureWorkedOn", value)} />
                  <Field placeholder="Stage: Building, Testing, Deployed..." value={form.stage} onChangeText={(value) => update("stage", value)} />
                  <Field placeholder="Proof link" value={form.proofLink} onChangeText={(value) => update("proofLink", value)} />
                  <Field placeholder="Blocker" value={form.blocker} onChangeText={(value) => update("blocker", value)} />
                  <Field placeholder="Next action" value={form.nextAction} onChangeText={(value) => update("nextAction", value)} />
                </>
              ) : null}

              {mode === "proof" ? (
                <>
                  <Field placeholder="Proof label" value={form.proofLabel} onChangeText={(value) => update("proofLabel", value)} />
                  <Field placeholder="Proof URL" value={form.proofLink} onChangeText={(value) => update("proofLink", value)} />
                  <Field placeholder="Proof note" multiline value={form.proofText} onChangeText={(value) => update("proofText", value)} />
                </>
              ) : null}

              {mode === "checkin" ? (
                <>
                  <Field placeholder="Main goal today" value={form.mainGoal} onChangeText={(value) => update("mainGoal", value)} />
                  <Field placeholder="Mood" value={form.mood} onChangeText={(value) => update("mood", value)} />
                  <Field keyboardType="number-pad" placeholder="Energy 1-10" value={form.energy} onChangeText={(value) => update("energy", value)} />
                </>
              ) : null}

              {mode === "review" ? (
                <>
                  <Field placeholder="Biggest output today" value={form.biggestOutput} onChangeText={(value) => update("biggestOutput", value)} />
                  <Field placeholder="Method that worked" value={form.methodWorked} onChangeText={(value) => update("methodWorked", value)} />
                  <Field placeholder="What vanished today?" value={form.vanished} onChangeText={(value) => update("vanished", value)} />
                  <Field placeholder="End of day review" multiline value={form.endOfDayReview} onChangeText={(value) => update("endOfDayReview", value)} />
                </>
              ) : null}

              <PrimaryButton title={saving ? "Saving" : "Save Proof"} loading={saving} onPress={() => void submitQuickLog()} />
              <GhostButton title="Cancel" onPress={() => setQuickLogOpen(false)} />
              {blockStartedAt ? (
                <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.sm, justifyContent: "center" }}>
                  <CheckCircle2 color={colors.success} size={18} />
                  <Text style={{ color: colors.muted }}>Work block is currently running.</Text>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  )
}

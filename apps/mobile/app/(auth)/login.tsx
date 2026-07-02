import { useState } from "react"
import { KeyboardAvoidingView, Platform, Text, View } from "react-native"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Field, GhostButton, PrimaryButton, Screen } from "@/components"
import { readableError, useSession } from "@/auth"
import { colors, radius, spacing, typography } from "@/theme"

export default function LoginScreen() {
  const { requestOtp } = useSession()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [devCode, setDevCode] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError("")
    setDevCode("")
    setLoading(true)
    try {
      const response = await requestOtp(email)
      if (response.devCode) setDevCode(response.devCode)
      router.push({ pathname: "/otp", params: { email, devCode: response.devCode || "" } })
    } catch (err) {
      setError(readableError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "space-between", padding: spacing.xl }}>
          <View style={{ marginTop: spacing.xxxl }}>
            <LinearGradient colors={["rgba(10,132,255,0.24)", "rgba(212,168,83,0.08)"]} style={{ borderRadius: radius.xl, minHeight: 220, padding: spacing.xl, justifyContent: "flex-end" }}>
              <Text style={{ color: colors.gold, fontSize: typography.caption, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }}>FounderBox Mobile</Text>
              <Text style={{ color: colors.text, fontSize: 42, fontWeight: "900", lineHeight: 44, marginTop: spacing.sm }}>Proof beats plans.</Text>
              <Text style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23, marginTop: spacing.md }}>
                Track revenue attempts, shipped outputs, work blocks, and proof from your phone.
              </Text>
            </LinearGradient>
          </View>

          <View style={{ gap: spacing.md }}>
            <Field value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />
            <PrimaryButton title="Send login code" onPress={submit} loading={loading} disabled={!email.includes("@")} />
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <View style={{ flex: 1 }}><GhostButton title="Google soon" /></View>
              <View style={{ flex: 1 }}><GhostButton title="GitHub soon" /></View>
            </View>
            {devCode ? <Text style={{ color: colors.gold }}>Dev code: {devCode}</Text> : null}
            {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}

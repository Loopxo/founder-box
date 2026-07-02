import { useState } from "react"
import { KeyboardAvoidingView, Platform, Text, View } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Field, PrimaryButton, Screen } from "@/components"
import { readableError, useSession } from "@/auth"
import { colors, spacing, typography } from "@/theme"

export default function OtpScreen() {
  const params = useLocalSearchParams<{ email?: string; devCode?: string }>()
  const { verifyOtp } = useSession()
  const [code, setCode] = useState(params.devCode || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const email = params.email || ""

  async function submit() {
    setError("")
    setLoading(true)
    try {
      await verifyOtp(email, code)
      router.replace("/")
    } catch (err) {
      setError(readableError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "flex-end", gap: spacing.lg, padding: spacing.xl }}>
          <View>
            <Text style={{ color: colors.text, fontSize: typography.display, fontWeight: "900" }}>Enter code</Text>
            <Text style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23, marginTop: spacing.sm }}>
              We sent a FounderBox login code to {email}.
            </Text>
          </View>
          <Field value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="000000" maxLength={6} />
          <PrimaryButton title="Open FounderBox" onPress={submit} loading={loading} disabled={code.length < 6 || !email} />
          {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}

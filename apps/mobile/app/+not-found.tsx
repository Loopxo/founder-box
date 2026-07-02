import { Link } from "expo-router"
import { Text, View } from "react-native"
import { Screen } from "@/components"
import { colors, spacing, typography } from "@/theme"

export default function NotFound() {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", padding: spacing.xl }}>
        <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "800" }}>Screen not found</Text>
        <Link href="/" style={{ color: colors.primary, fontSize: typography.body, marginTop: spacing.lg }}>Back to FounderBox</Link>
      </View>
    </Screen>
  )
}

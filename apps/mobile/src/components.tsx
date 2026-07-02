import { ReactNode } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { colors, radius, spacing, typography } from "./theme"

export function Screen({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.screen}>{children}</SafeAreaView>
}

export function Header({ eyebrow, title, right }: { eyebrow?: string; title: string; right?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      {right}
    </View>
  )
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: {
  title: string
  onPress?: () => void
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [{ opacity: disabled ? 0.45 : pressed ? 0.86 : 1 }]}>
      <LinearGradient colors={[colors.primary, "#36C5FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primaryButton}>
        {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.primaryButtonText}>{title}</Text>}
      </LinearGradient>
    </Pressable>
  )
}

export function GhostButton({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.ghostButton, { opacity: pressed ? 0.72 : 1 }]}>
      <Text style={styles.ghostButtonText}>{title}</Text>
    </Pressable>
  )
}

export function Field(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.muted} autoCapitalize="none" autoCorrect={false} {...props} style={[styles.input, props.style]} />
}

export function MetricCard({ label, value, accent = colors.primary }: { label: string; value: string | number; accent?: string }) {
  return (
    <Card style={styles.metricCard}>
      <Text style={[styles.metricValue, { color: accent }]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </Card>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  eyebrow: {
    color: colors.gold,
    fontSize: typography.caption,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xl,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: radius.lg,
    minHeight: 60,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },
  ghostButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.lg,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  ghostButtonText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  metricCard: {
    flex: 1,
    minHeight: 112,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "900",
  },
  metricLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800",
  },
  emptyBody: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 23,
    marginTop: spacing.sm,
  },
})

import { Alert, Pressable, ScrollView, Text, View } from "react-native"
import * as Linking from "expo-linking"
import { FileText, Search, Sparkles, Zap } from "lucide-react-native"
import { Card, Header, PrimaryButton, Screen } from "@/components"
import { FOUNDERBOX_API_URL } from "@/env"
import { colors, radius, spacing, typography } from "@/theme"

const tools = [
  { name: "Proposal Generator", path: "/dashboard/proposal", body: "Create client proposals, pricing packages, and PDF artifacts." },
  { name: "Resume Forge", path: "/resume", body: "Tailor resumes for job roles and export polished PDFs." },
  { name: "Startup Lens", path: "/startup-lens", body: "Analyze startup ideas with the FounderBox framework." },
  { name: "Cold Emails", path: "/cold-emails", body: "Generate outreach messages and sequences. Copy only; no sending in V1." },
  { name: "Competitive Analysis", path: "/competitive-analysis", body: "Compare companies, SWOT, positioning, and gaps from provided facts." },
  { name: "Contracts", path: "/contract", body: "Draft client contracts with legal-disclaimer-first outputs." },
  { name: "Invoices", path: "/invoice", body: "Create deterministic invoice totals, tax, currency, and PDFs." },
  { name: "SEO Content", path: "/seo", body: "Build SEO plans without pretending to live-crawl sites." },
  { name: "Sales Copy", path: "/sales", body: "Generate SDR scripts, follow-ups, and sales sequences." },
  { name: "Social Media", path: "/social-media-content", body: "Create content calendars, post ideas, and platform-specific angles." },
]

async function openWebTool(path: string) {
  const url = `${FOUNDERBOX_API_URL}${path}`
  const supported = await Linking.canOpenURL(url)
  if (!supported) {
    Alert.alert("Cannot open tool", url)
    return
  }
  await Linking.openURL(url)
}

export default function DiscoverScreen() {
  return (
    <Screen>
      <Header title="Discover" right={<Zap color={colors.amber} size={30} />} />
      <ScrollView contentContainerStyle={{ gap: spacing.xl, padding: spacing.xl, paddingTop: spacing.sm }}>
        <View style={{ alignItems: "center", backgroundColor: colors.surface, borderRadius: radius.xl, flexDirection: "row", gap: spacing.md, minHeight: 58, paddingHorizontal: spacing.lg }}>
          <Search color={colors.muted} size={24} />
          <Text style={{ color: colors.muted, fontSize: typography.body }}>Search tools, workflows...</Text>
        </View>
        <Card style={{ minHeight: 220, justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: colors.gold, fontSize: typography.caption, fontWeight: "900", textTransform: "uppercase" }}>Featured Sprint</Text>
            <Text style={{ color: colors.text, fontSize: 32, fontWeight: "900", lineHeight: 34, marginTop: spacing.sm }}>Client Outreach Sprint</Text>
            <Text style={{ color: colors.muted, fontSize: typography.body, lineHeight: 23, marginTop: spacing.md }}>
              Plan the targets, run the blocks, log every method, and see what actually gets replies.
            </Text>
          </View>
          <PrimaryButton title="Install Sprint Flow" onPress={() => Alert.alert("Use Custom tab", "Install Client Outreach Sprint from the Custom tab.")} />
        </Card>

        <Text style={{ color: colors.text, fontSize: typography.title, fontWeight: "900" }}>Founder Tools</Text>
        <View style={{ gap: spacing.md }}>
          {tools.map((tool) => (
            <Pressable key={tool.name} onPress={() => void openWebTool(tool.path)}>
              <Card style={{ paddingVertical: spacing.lg }}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.md }}>
                  <View style={{ alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 22, height: 44, justifyContent: "center", width: 44 }}>
                    <FileText color={colors.primary} size={22} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontSize: typography.body, fontWeight: "900" }}>{tool.name}</Text>
                    <Text style={{ color: colors.muted, lineHeight: 21, marginTop: spacing.xs }}>{tool.body}</Text>
                  </View>
                  <Sparkles color={colors.gold} size={18} />
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}

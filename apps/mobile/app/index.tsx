import { ActivityIndicator, View } from "react-native"
import { Redirect } from "expo-router"
import { colors } from "@/theme"
import { useSession } from "@/auth"

export default function IndexRoute() {
  const { loading, token, workspace } = useSession()
  if (loading || (token && !workspace)) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return <Redirect href={token ? (workspace?.persona ? "/today" : "/onboarding") : "/login"} />
}

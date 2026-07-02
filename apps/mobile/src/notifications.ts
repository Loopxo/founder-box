import { Platform } from "react-native"
import * as Notifications from "expo-notifications"
import { type FounderBoxClient } from "@founderbox/api-client"
import { EXPO_PROJECT_ID } from "./env"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export async function ensureNotificationPermission() {
  const current = await Notifications.getPermissionsAsync()
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return true
  const requested = await Notifications.requestPermissionsAsync()
  return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
}

export async function ensureNotificationChannel() {
  if (Platform.OS !== "android") return
  await Notifications.setNotificationChannelAsync("founderbox-work", {
    name: "FounderBox Work Blocks",
    importance: Notifications.AndroidImportance.HIGH,
  })
}

export async function scheduleWorkBlockEndReminder(minutes: number, label = "work block") {
  const granted = await ensureNotificationPermission()
  if (!granted) return null
  await ensureNotificationChannel()
  const safeMinutes = Math.max(1, Math.round(minutes))
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Work block complete",
      body: `Log the output from your ${safeMinutes} minute ${label}.`,
      data: { type: "work_block_end" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: safeMinutes * 60,
      channelId: "founderbox-work",
    },
  })
}

export async function scheduleDailyProofReminder(hour = 20, minute = 30) {
  const granted = await ensureNotificationPermission()
  if (!granted) return null
  await ensureNotificationChannel()
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "FounderBox daily proof",
      body: "Close the day with revenue attempts, shipped outputs, and proof.",
      data: { type: "daily_proof" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: "founderbox-work",
    },
  })
}

export async function registerPushDevice(client: FounderBoxClient) {
  const granted = await ensureNotificationPermission()
  if (!granted || !EXPO_PROJECT_ID) return false
  await ensureNotificationChannel()
  const token = await Notifications.getExpoPushTokenAsync({ projectId: EXPO_PROJECT_ID })
  await client.registerPushDevice({
    expoPushToken: token.data,
    platform: Platform.OS,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
  return true
}

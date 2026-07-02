export const colors = {
  background: "#050506",
  surface: "#1A1A1D",
  surfaceRaised: "#232329",
  surfaceSoft: "#2D2D33",
  border: "#303036",
  text: "#F5F5F7",
  muted: "#8E8E93",
  primary: "#0A84FF",
  primarySoft: "rgba(10, 132, 255, 0.12)",
  gold: "#D4A853",
  amber: "#FF9F0A",
  success: "#32D74B",
  danger: "#FF453A",
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const

export const typography = {
  display: 34,
  title: 24,
  body: 16,
  caption: 13,
} as const

export function formatMinutes(minutes?: number | null) {
  const value = Number(minutes || 0)
  const hours = Math.floor(value / 60)
  const mins = value % 60
  if (hours <= 0) return `${mins}m`
  if (mins <= 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

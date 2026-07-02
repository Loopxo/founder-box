import { cn } from "@/lib/utils"

export interface ChartPoint {
  label: string
  value: number
}

/** Lightweight dependency-free bar chart for daily/weekly metrics. */
export function BarChart({
  data,
  height = 140,
  color = "#D4A853",
  className,
  valueFormatter,
}: {
  data: ChartPoint[]
  height?: number
  color?: string
  className?: string
  valueFormatter?: (v: number) => string
}) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className={cn("flex items-end gap-2", className)} style={{ height }}>
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * (height - 28))
        return (
          <div key={`${d.label}-${i}`} className="flex flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[10px] font-semibold text-[#9E9880]">
              {valueFormatter ? valueFormatter(d.value) : d.value}
            </span>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: Math.max(2, h),
                background: d.value > 0 ? color : "#2A2A38",
                opacity: d.value > 0 ? 1 : 0.5,
              }}
              title={`${d.label}: ${d.value}`}
            />
            <span className="text-[10px] text-[#68634F]">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/** Compact inline sparkline. */
export function Sparkline({
  values,
  width = 120,
  height = 32,
  color = "#D4A853",
  className,
}: {
  values: number[]
  width?: number
  height?: number
  color?: string
  className?: string
}) {
  if (values.length === 0) return null
  const max = Math.max(1, ...values)
  const step = values.length > 1 ? width / (values.length - 1) : width
  const points = values
    .map((v, i) => `${i * step},${height - (v / max) * (height - 4) - 2}`)
    .join(" ")
  return (
    <svg width={width} height={height} className={className} role="img" aria-label="Trend">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

/** GitHub-style activity heatmap. cells are most-recent-last. */
export function ActivityHeatmap({
  cells,
  className,
}: {
  cells: { label: string; value: number }[]
  className?: string
}) {
  const max = Math.max(1, ...cells.map((c) => c.value))
  const shade = (v: number) => {
    if (v <= 0) return "#1E1E28"
    const ratio = v / max
    if (ratio > 0.66) return "#D4A853"
    if (ratio > 0.33) return "#A07830"
    return "#5C4A22"
  }
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {cells.map((c, i) => (
        <div
          key={`${c.label}-${i}`}
          className="h-4 w-4 rounded-sm"
          style={{ background: shade(c.value) }}
          title={`${c.label}: ${c.value} ${c.value === 1 ? "entry" : "entries"}`}
        />
      ))}
    </div>
  )
}

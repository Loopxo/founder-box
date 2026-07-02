import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: string
  trend?: { value: number; label?: string }
  accent?: boolean
  className?: string
}

export function StatCard({ label, value, hint, trend, accent, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-[#18181F] p-4 transition-colors hover:border-[#3A3830]",
        className
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9E9880]">{label}</p>
      <p className={cn("mt-1.5 text-2xl font-extrabold", accent ? "text-[#D4A853]" : "text-[#EDE9DC]")}>{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "text-xs font-semibold",
              trend.value > 0 ? "text-[#4D9E6A]" : trend.value < 0 ? "text-[#C0514A]" : "text-[#9E9880]"
            )}
          >
            {trend.value > 0 ? "▲" : trend.value < 0 ? "▼" : "■"} {Math.abs(trend.value)}
            {trend.label ? ` ${trend.label}` : ""}
          </span>
        )}
        {hint && <span className="text-xs text-[#9E9880]">{hint}</span>}
      </div>
    </div>
  )
}

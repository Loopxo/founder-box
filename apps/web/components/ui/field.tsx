import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}

export function Field({ label, htmlFor, required, hint, error, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9E9880]"
      >
        {label}
        {required && <span className="text-[#C0514A]">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-[#C0514A]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[#68634F]">{hint}</p>
      ) : null}
    </div>
  )
}

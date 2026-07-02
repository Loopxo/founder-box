import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: { label: string; href: string }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-[#18181F] px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#1E1E28] text-[#D4A853]">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm font-semibold text-[#EDE9DC]">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-[#9E9880]">{description}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-5 rounded-md bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#111118] transition-opacity hover:opacity-90"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}

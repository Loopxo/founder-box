"use client"

import { useMemo, useState } from "react"
import { Search, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/toast"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

export interface EntryRow {
  id: string
  title: string
  timestamp: string
  meta: { label: string; value: string }[]
}

interface EntryListProps {
  initialEntries: EntryRow[]
  emptyTitle: string
  emptyDescription?: string
  searchPlaceholder?: string
}

export function EntryList({ initialEntries, emptyTitle, emptyDescription, searchPlaceholder = "Search entries…" }: EntryListProps) {
  const toast = useToast()
  const [entries, setEntries] = useState(initialEntries)
  const [query, setQuery] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.meta.some((m) => m.value.toLowerCase().includes(q))
    )
  }, [entries, query])

  async function remove(id: string) {
    if (deleting) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/entries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || "Could not delete entry.")
      }
      setEntries((prev) => prev.filter((e) => e.id !== id))
      toast.success("Entry removed")
    } catch (error) {
      toast.error("Delete failed", error instanceof Error ? error.message : undefined)
    } finally {
      setDeleting(null)
    }
  }

  if (entries.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div>
      <div className="relative mb-3 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#68634F]" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={searchPlaceholder} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-[#18181F] p-6 text-center text-sm text-[#9E9880]">
          No entries match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-[#18181F]">
          {filtered.map((entry) => (
            <div key={entry.id} className="group flex items-center gap-3 border-b border-border p-4 text-sm last:border-b-0 hover:bg-white/[0.02]">
              <div className="grid flex-1 gap-2 lg:grid-cols-4">
                <span className="font-semibold text-[#EDE9DC]">{entry.title}</span>
                {entry.meta.map((m, i) => (
                  <span key={i} className="text-[#9E9880]">{m.value}</span>
                ))}
                <span className="text-[#68634F]">{entry.timestamp}</span>
              </div>
              <button
                onClick={() => remove(entry.id)}
                disabled={deleting === entry.id}
                className="shrink-0 rounded p-1.5 text-[#68634F] opacity-0 transition-all hover:bg-[#C0514A]/10 hover:text-[#C0514A] group-hover:opacity-100 disabled:opacity-50"
                aria-label="Delete entry"
              >
                {deleting === entry.id ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

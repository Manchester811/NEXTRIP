import { SlidersHorizontal } from 'lucide-react'
import type { SortKey } from '@/types/results'
import { cn } from '@/lib/utils'

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'earliest', label: 'Earliest departure' },
  { id: 'rated', label: 'Highest rated' },
]

interface SortBarProps {
  value: SortKey
  onChange: (value: SortKey) => void
  resultCount: number
  onOpenFilters: () => void
}

export function SortBar({ value, onChange, resultCount, onOpenFilters }: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="hidden text-sm text-ink-500 sm:block">
        <span className="font-semibold text-ink-900">{resultCount}</span> results
      </p>

      <div className="flex flex-1 items-center gap-1.5 overflow-x-auto sm:flex-none">
        {SORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
              value === s.id
                ? 'border-signal-600 bg-signal-50 text-signal-700'
                : 'border-ink-900/10 text-ink-600 hover:border-ink-900/25',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button
        onClick={onOpenFilters}
        className="flex shrink-0 items-center gap-1.5 rounded-full border border-ink-900/10 px-3.5 py-1.5 text-xs font-medium text-ink-700 lg:hidden"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
      </button>
    </div>
  )
}

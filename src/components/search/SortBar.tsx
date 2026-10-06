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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-[var(--color-text-secondary)]">
        <span className="font-semibold text-[var(--color-text-primary)]">{resultCount}</span> {resultCount === 1 ? 'result' : 'results'}
      </p>

      <div className="flex flex-1 items-center gap-2 overflow-x-auto sm:flex-none">
        {SORTS.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            className={cn(
              'shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200',
              value === s.id
                ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] shadow-[0_2px_10px_rgba(59,130,246,.3)]'
                : 'bg-white/5 text-[var(--color-text-secondary)] border border-white/10 hover:bg-white/10 hover:text-[var(--color-text-primary)] hover:border-white/20',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button
        onClick={onOpenFilters}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-[var(--color-text-secondary)] lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>
    </div>
  )
}
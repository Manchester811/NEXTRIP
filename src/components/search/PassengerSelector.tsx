import * as Popover from '@radix-ui/react-popover'
import { Users, ChevronDown } from 'lucide-react'
import type { PassengerCount } from '@/types/transport'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface PassengerSelectorProps {
  value: PassengerCount
  onChange: (value: PassengerCount) => void
  travelClass?: string
  onTravelClassChange?: (value: string) => void
  classOptions?: string[]
  compact?: boolean
}

const ROWS: { key: keyof PassengerCount; label: string; hint: string; min: number }[] = [
  { key: 'adults', label: 'Adults', hint: '12+ years', min: 1 },
  { key: 'children', label: 'Children', hint: '2–11 years', min: 0 },
  { key: 'infants', label: 'Infants', hint: 'Under 2 years', min: 0 },
]

export function PassengerSelector({
  value,
  onChange,
  travelClass,
  onTravelClassChange,
  classOptions,
  compact,
}: PassengerSelectorProps) {


  const step = (key: keyof PassengerCount, delta: number, min: number) => {
    onChange({ ...value, [key]: Math.max(min, Math.min(9, value[key] + delta)) })
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all duration-200',
            compact && 'py-2.5',
            'bg-[var(--color-bg-secondary)] border border-white/10 text-[var(--color-text-primary)] hover:border-white/15 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
          )}
        >
          <Users className="h-5 w-5 text-[var(--color-text-muted)] shrink-0" strokeWidth={2} />
          <span className="flex-1 min-w-0">
            <span className="block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
              Travellers{travelClass ? ' & Class' : ''}
            </span>
            <span className="block truncate text-sm font-medium text-[var(--color-text-primary)]">
              {value.adults + value.children + value.infants} {value.adults + value.children + value.infants === 1 ? 'Traveller' : 'Travellers'}
              {travelClass ? ` · ${travelClass}` : ''}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          className="z-50 w-[320px] rounded-2xl border border-white/10 bg-[var(--color-bg-card)] p-4 shadow-[0_20px_40px_rgba(2,9,20,0.4)] focus-visible:outline-none"
        >
          <div className="space-y-4">
            {ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{row.label}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{row.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Decrease ${row.label}`}
                    disabled={value[row.key] <= row.min}
                    onClick={() => step(row.key, -1, row.min)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[var(--color-text-secondary)] disabled:opacity-30 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                  <span className="w-10 text-center text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">{value[row.key]}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${row.label}`}
                    onClick={() => step(row.key, 1, row.min)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {classOptions && classOptions.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <p className="mb-3 text-sm font-medium text-[var(--color-text-secondary)]">Class</p>
              <div className="flex flex-wrap gap-2">
                {classOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onTravelClassChange?.(c)}
                    className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      travelClass === c
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Popover.Close asChild>
            <Button variant="primary" size="sm" className="mt-4 w-full">
              Done
            </Button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}


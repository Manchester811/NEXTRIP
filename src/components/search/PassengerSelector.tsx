import * as Popover from '@radix-ui/react-popover'
import { Minus, Plus, Users, ChevronDown } from 'lucide-react'
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
  const total = value.adults + value.children + value.infants

  const step = (key: keyof PassengerCount, delta: number, min: number) => {
    onChange({ ...value, [key]: Math.max(min, Math.min(9, value[key] + delta)) })
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex w-full items-center gap-2.5 rounded-lg px-3.5 py-3 text-left transition-colors hover:bg-ink-900/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500',
            compact && 'py-2',
          )}
        >
          <Users className="h-[18px] w-[18px] text-ink-400 shrink-0" strokeWidth={1.75} />
          <span className="flex-1 min-w-0">
            <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-400">
              Travellers{travelClass ? ' & class' : ''}
            </span>
            <span className="block truncate text-[15px] font-semibold text-ink-900">
              {total} {total === 1 ? 'Passenger' : 'Passengers'}
              {travelClass ? ` · ${travelClass}` : ''}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 text-ink-400" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="start"
          className="z-50 w-[300px] rounded-xl border border-paper-line bg-white p-4 shadow-[0_20px_40px_rgba(10,15,28,0.14)] focus-visible:outline-none"
        >
          <div className="flex flex-col gap-3.5">
            {ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-900">{row.label}</p>
                  <p className="text-xs text-ink-400">{row.hint}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Decrease ${row.label}`}
                    disabled={value[row.key] <= row.min}
                    onClick={() => step(row.key, -1, row.min)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 text-ink-700 disabled:opacity-30 hover:border-signal-500 hover:text-signal-600"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-4 text-center text-sm font-semibold tabular-nums">{value[row.key]}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${row.label}`}
                    onClick={() => step(row.key, 1, row.min)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 text-ink-700 hover:border-signal-500 hover:text-signal-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {classOptions && classOptions.length > 0 && (
            <div className="mt-4 border-t border-paper-line pt-4">
              <p className="mb-2 text-sm font-medium text-ink-900">Class</p>
              <div className="flex flex-wrap gap-1.5">
                {classOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onTravelClassChange?.(c)}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                      travelClass === c
                        ? 'border-signal-600 bg-signal-50 text-signal-700'
                        : 'border-ink-900/15 text-ink-600 hover:border-ink-900/30',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Popover.Close asChild>
            <Button variant="signal" size="sm" className="mt-4 w-full">
              Done
            </Button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

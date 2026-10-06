import { Star, X } from 'lucide-react'
import type { ResultFilters } from '@/types/results'
import { Checkbox } from '@/components/ui/Checkbox'
import { Slider } from '@/components/ui/Slider'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const DEPARTURE_WINDOWS = [
  { id: 'early', label: 'Before 6 AM' },
  { id: 'morning', label: '6 AM – 12 PM' },
  { id: 'afternoon', label: '12 PM – 6 PM' },
  { id: 'night', label: 'After 6 PM' },
]

interface FilterPanelProps {
  filters: ResultFilters
  onChange: (filters: ResultFilters) => void
  operators: string[]
  amenityOptions: string[]
  priceBounds: [number, number]
  showStops?: boolean
  onClose?: () => void
}

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export function FilterPanel({ filters, onChange, operators, amenityOptions, priceBounds, showStops, onClose }: FilterPanelProps) {
  const hasActiveFilters =
    filters.departureWindows.length > 0 ||
    filters.operators.length > 0 ||
    filters.minRating > 0 ||
    filters.amenities.length > 0 ||
    filters.stops !== 'any' ||
    filters.priceRange[0] !== priceBounds[0] ||
    filters.priceRange[1] !== priceBounds[1]

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">Filters</h3>
        {hasActiveFilters && onClose && (
          <button
            type="button"
            onClick={() => onChange({ priceRange: priceBounds, departureWindows: [], operators: [], minRating: 0, amenities: [], stops: 'any' })}
            className="text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Price range">
        <div className="px-1">
          <Slider
            value={filters.priceRange}
            min={priceBounds[0]}
            max={priceBounds[1]}
            step={10}
            onChange={(priceRange) => onChange({ ...filters, priceRange })}
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-[var(--color-text-muted)]">
            <span>₹{filters.priceRange[0].toLocaleString('en-IN')}</span>
            <span>₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Departure time">
        <div className="grid grid-cols-2 gap-2">
          {DEPARTURE_WINDOWS.map((w) => {
            const active = filters.departureWindows.includes(w.id)
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onChange({ ...filters, departureWindows: toggle(filters.departureWindows, w.id) })}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-left text-xs font-medium transition-all duration-200',
                  active
                    ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/20'
                    : 'bg-white/5 text-[var(--color-text-secondary)] border border-white/10 hover:bg-white/10 hover:text-[var(--color-text-primary)]',
                )}
              >
                {w.label}
              </button>
            )
          })}
        </div>
      </FilterSection>

      {showStops && (
        <FilterSection title="Stops">
          <div className="flex flex-col gap-2">
            {(
              [
                ['any', 'Any'],
                ['nonstop', 'Nonstop only'],
                ['1stop', '1 stop or fewer'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] cursor-pointer">
                <input
                  type="radio"
                  name="stops"
                  checked={filters.stops === value}
                  onChange={() => onChange({ ...filters, stops: value })}
                  className="h-4 w-4 accent-[var(--color-accent)]"
                />
                {label}
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Operator">
        <div className="flex flex-col gap-2">
          {operators.map((op) => (
            <label key={op} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] cursor-pointer">
              <Checkbox
                checked={filters.operators.includes(op)}
                onCheckedChange={() => onChange({ ...filters, operators: toggle(filters.operators, op) })}
              />
              {op}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="flex flex-col gap-2">
          {[4, 3, 0].map((r) => (
            <label key={r} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="h-4 w-4 accent-[var(--color-accent)]"
              />
              {r === 0 ? (
                'Any rating'
              ) : (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                  {r}.0 & above
                </span>
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Amenities">
        <div className="flex flex-col gap-2">
          {amenityOptions.map((a) => (
            <label key={a} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] cursor-pointer">
              <Checkbox
                checked={filters.amenities.includes(a)}
                onCheckedChange={() => onChange({ ...filters, amenities: toggle(filters.amenities, a) })}
              />
              {a}
            </label>
          ))}
        </div>
      </FilterSection>

      <div className="mt-auto pt-4 border-t border-white/10 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => onChange({ priceRange: priceBounds, departureWindows: [], operators: [], minRating: 0, amenities: [], stops: 'any' })}>
          Clear all
        </Button>
        <Button variant="primary" className="flex-1" onClose={onClose}>
          Apply
        </Button>
      </div>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[var(--color-text-secondary)]">{title}</p>
      {children}
    </div>
  )
}
import { Star } from 'lucide-react'
import type { ResultFilters } from '@/types/results'
import { Checkbox } from '@/components/ui/Checkbox'
import { Slider } from '@/components/ui/Slider'
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
}

function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export function FilterPanel({ filters, onChange, operators, amenityOptions, priceBounds, showStops }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <FilterSection title="Price range">
        <div className="px-1">
          <Slider
            value={filters.priceRange}
            min={priceBounds[0]}
            max={priceBounds[1]}
            step={10}
            onChange={(priceRange) => onChange({ ...filters, priceRange })}
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-ink-500">
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
                  'rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors',
                  active ? 'border-signal-600 bg-signal-50 text-signal-700' : 'border-ink-900/10 text-ink-600 hover:border-ink-900/25',
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
              <label key={value} className="flex items-center gap-2.5 text-sm text-ink-700">
                <input
                  type="radio"
                  name="stops"
                  checked={filters.stops === value}
                  onChange={() => onChange({ ...filters, stops: value })}
                  className="h-3.5 w-3.5 accent-[#0d8a7d]"
                />
                {label}
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Operator">
        <div className="flex flex-col gap-2.5">
          {operators.map((op) => (
            <label key={op} className="flex items-center gap-2.5 text-sm text-ink-700">
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
            <label key={r} className="flex items-center gap-2.5 text-sm text-ink-700">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                className="h-3.5 w-3.5 accent-[#0d8a7d]"
              />
              {r === 0 ? (
                'Any rating'
              ) : (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {r}.0 &amp; above
                </span>
              )}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Amenities">
        <div className="flex flex-col gap-2.5">
          {amenityOptions.map((a) => (
            <label key={a} className="flex items-center gap-2.5 text-sm text-ink-700">
              <Checkbox
                checked={filters.amenities.includes(a)}
                onCheckedChange={() => onChange({ ...filters, amenities: toggle(filters.amenities, a) })}
              />
              {a}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-ink-950">{title}</p>
      {children}
    </div>
  )
}

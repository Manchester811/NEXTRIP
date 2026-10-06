import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeftRight, Search, Calendar, Users, ChevronDown, MapPin } from 'lucide-react'
import type { PassengerCount, SearchParams, TransportMode } from '@/types/transport'
import { TRANSPORT_MODES } from '@/data/modes'
import { ModeIcon } from '@/components/transport/ModeIcon'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const CLASS_OPTIONS: Partial<Record<TransportMode, string[]>> = {
  flight: ['Economy', 'Premium Economy', 'Business'],
  train: ['Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'AC First'],
  ferry: ['Deck', 'AC Seater', 'Cabin'],
}

const todayIso = () => new Date().toISOString().slice(0, 10)

interface SearchWidgetProps {
  className?: string
  floating?: boolean
  initial?: SearchParams
  onSearch?: (params: SearchParams) => void
}

export function SearchWidget({ className, floating = false, initial, onSearch }: SearchWidgetProps) {
  const navigate = useNavigate()
  const [mode, setMode] = useState<TransportMode>(initial?.mode ?? 'bus')
  const [origin, setOrigin] = useState(initial?.origin ?? '')
  const [destination, setDestination] = useState(initial?.destination ?? '')
  const [departDate, setDepartDate] = useState(initial?.departDate ?? todayIso())
  const [returnDate, setReturnDate] = useState(initial?.returnDate ?? '')
  const [roundTrip, setRoundTrip] = useState(Boolean(initial?.returnDate))
  const [passengers, setPassengers] = useState<PassengerCount>(
    initial?.passengers ?? { adults: 1, children: 0, infants: 0 },
  )
  const [travelClass, setTravelClass] = useState<string | undefined>(initial?.travelClass)
  const [error, setError] = useState('')
  const [passengerPopoverOpen, setPassengerPopoverOpen] = useState(false)
  const [, setClassPopoverOpen] = useState(false)

  const meta = useMemo(() => TRANSPORT_MODES.find((m) => m.id === mode)!, [mode])
  const classOptions = CLASS_OPTIONS[mode]
  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  const swap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both origin and destination.')
      return
    }
    setError('')
    const query = new URLSearchParams({
      mode,
      origin,
      destination,
      date: departDate,
      adults: String(passengers.adults),
      children: String(passengers.children),
      infants: String(passengers.infants),
    })
    if (roundTrip && returnDate) query.set('return', returnDate)
    if (travelClass) query.set('class', travelClass)
    navigate(`/search?${query.toString()}`)
    onSearch?.({ mode, origin, destination, departDate, returnDate: roundTrip ? returnDate : undefined, passengers, travelClass })
  }

  const passengerLabel = `${totalPassengers} ${totalPassengers === 1 ? 'Traveller' : 'Travellers'}`

  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-white/10 bg-[var(--color-bg-card)]',
        floating && 'relative z-20 shadow-[0_25px_80px_rgba(2,9,20,0.5)]',
        className,
      )}
    >
      {/* Mode selector - pill style */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5" role="tablist" aria-label="Transport mode">
        {TRANSPORT_MODES.map((m) => {
          const active = m.id === mode
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(m.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] shadow-[0_2px_10px_rgba(59,130,246,.3)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5',
              )}
            >
              <ModeIcon mode={m.id} className="h-4 w-4" strokeWidth={2} />
              {m.shortLabel}
            </button>
          )
        })}
      </div>

      <div className="p-4 lg:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_48px_1fr_140px_160px_160px] lg:items-end lg:gap-3">
              {/* Origin */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  {meta.originLabel}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder={mode === 'cab' ? 'Enter pickup address' : 'City, station or airport'}
                    className="w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] pl-12 pr-4 py-3.5 text-sm transition-all duration-200 hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]"
                  />
                </div>
              </div>

              {/* Swap button */}
              <div className="hidden lg:flex items-center justify-center">
                <button
                  type="button"
                  onClick={swap}
                  aria-label="Swap origin and destination"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[var(--color-text-muted)] hover:bg-white/10 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/50 transition-all duration-300"
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </button>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  {meta.destinationLabel}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={mode === 'cab' ? 'Enter drop address' : 'City, station or airport'}
                    className="w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] pl-12 pr-4 py-3.5 text-sm transition-all duration-200 hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]"
                  />
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                  <input
                    type="date"
                    value={departDate}
                    min={todayIso()}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10 text-[var(--color-text-primary)] pl-12 pr-4 py-3.5 text-sm transition-all duration-200 hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)] [color-scheme:light]"
                  />
                </div>
              </div>

              {/* Return Date / Add Return */}
              {mode === 'flight' ? (
                roundTrip ? (
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Return</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                      <input
                        type="date"
                        value={returnDate}
                        min={departDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10 text-[var(--color-text-primary)] pl-12 pr-4 py-3.5 text-sm transition-all duration-200 hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)] [color-scheme:light]"
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setRoundTrip(true); setReturnDate(departDate) }}
                    className="w-full flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10 px-4 py-3.5 text-left transition-all duration-200 hover:bg-white/10 hover:border-[var(--color-accent)]/50"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Return</span>
                    <span className="text-sm font-semibold text-[var(--color-accent)]">+ Add return</span>
                  </button>
                )
              ) : (
                <div className="hidden lg:block" />
              )}

              {/* Passengers & Class */}
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                  Travellers {classOptions ? ' & Class' : ''}
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => { setPassengerPopoverOpen(!passengerPopoverOpen); setClassPopoverOpen(false) }}
                    className="w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10 text-[var(--color-text-primary)] pl-12 pr-12 py-3.5 text-sm text-left transition-all duration-200 hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]"
                  >
                    <span className="flex items-center justify-between w-full">
                      <span>{passengerLabel}</span>
                      <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                    </span>
                  </button>
                </div>

                {/* Passenger Popover */}
                <AnimatePresence>
                  {passengerPopoverOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute z-50 left-0 right-0 -mt-1"
                    >
                      <div className="rounded-xl border border-white/10 bg-[var(--color-bg-card)] p-4 shadow-[0_20px_40px_rgba(2,9,20,0.4)]">
                        <div className="space-y-4">
                          {[
                            { key: 'adults' as const, label: 'Adults', hint: '12+ years', min: 1 },
                            { key: 'children' as const, label: 'Children', hint: '2–11 years', min: 0 },
                            { key: 'infants' as const, label: 'Infants', hint: 'Under 2 years', min: 0 },
                          ].map((row) => (
                            <div key={row.key} className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-[var(--color-text-primary)]">{row.label}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{row.hint}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => setPassengers((p) => ({ ...p, [row.key]: Math.max(row.min, p[row.key] - 1) }))}
                                  disabled={passengers[row.key] <= row.min}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[var(--color-text-secondary)] disabled:opacity-30 hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)] transition-colors"
                                >
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                  </svg>
                                </button>
                                <span className="w-10 text-center text-sm font-semibold tabular-nums text-[var(--color-text-primary)]">{passengers[row.key]}</span>
                                <button
                                  type="button"
                                  onClick={() => setPassengers((p) => ({ ...p, [row.key]: Math.min(9, p[row.key] + 1) }))}
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
                                  onClick={() => { setTravelClass(c); setClassPopoverOpen(false) }}
                                  className={`rounded-pill px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                    travelClass === c
                                      ? 'bg-[var(--color-accent)] text-[var(--color-text-inverse)]'
                                      : 'bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-[var(--color-text-primary)]'
                                  }`}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                          <Button variant="secondary" className="flex-1" onClick={() => setPassengerPopoverOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="primary" className="flex-1" onClick={() => setPassengerPopoverOpen(false)}>
                            Done
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <div className="lg:col-span-1">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSearch}
                  className="w-full lg:w-auto lg:px-8"
                  disabled={!origin.trim() || !destination.trim()}
                >
                  <Search className="h-5 w-5" strokeWidth={2} />
                  <span className="hidden lg:inline">Search Tickets</span>
                  <span className="lg:hidden">Search</span>
                </Button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl bg-[var(--color-error-muted)] px-4 py-3 text-sm text-[var(--color-error)]"
                role="alert"
              >
                {error}
              </motion.p>
            )}

            {mode === 'flight' && roundTrip && (
              <button
                type="button"
                onClick={() => { setRoundTrip(false); setReturnDate('') }}
                className="mt-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
              >
                Remove return trip
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
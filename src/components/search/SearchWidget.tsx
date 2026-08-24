import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeftRight, Search } from 'lucide-react'
import type { PassengerCount, SearchParams, TransportMode } from '@/types/transport'
import { TRANSPORT_MODES } from '@/data/modes'
import { ModeIcon } from '@/components/transport/ModeIcon'
import { LocationField } from './LocationField'
import { DateField } from './DateField'
import { PassengerSelector } from './PassengerSelector'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const CLASS_OPTIONS: Partial<Record<TransportMode, string[]>> = {
  flight: ['Economy', 'Premium', 'Business'],
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

export function SearchWidget({ className, floating = true, initial, onSearch }: SearchWidgetProps) {
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

  const meta = useMemo(() => TRANSPORT_MODES.find((m) => m.id === mode)!, [mode])
  const classOptions = CLASS_OPTIONS[mode]
  const showOriginDestination = mode !== 'metro' ? true : true

  const swap = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim()) {
      setError('Add an origin and destination to search.')
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

  return (
    <div
      className={cn(
        'w-full rounded-2xl bg-white shadow-[0_24px_64px_rgba(6,9,16,0.28)] ring-1 ring-black/[0.04]',
        floating && 'relative z-20',
        className,
      )}
    >
      {/* Mode tabs — split-flap style segmented control */}
      <div className="flex gap-1 overflow-x-auto border-b border-paper-line px-3 pt-3 sm:px-4" role="tablist" aria-label="Transport mode">
        {TRANSPORT_MODES.map((m) => {
          const active = m.id === mode
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={active}
              onClick={() => setMode(m.id)}
              className={cn(
                'relative flex shrink-0 items-center gap-2 rounded-t-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                active ? 'text-ink-950' : 'text-ink-400 hover:text-ink-700',
              )}
            >
              <ModeIcon mode={m.id} className="h-4 w-4" />
              {m.label}
              {active && (
                <motion.span
                  layoutId="mode-underline"
                  className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-amber-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="p-3 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_auto_auto] lg:items-stretch lg:divide-x lg:divide-paper-line">
              {showOriginDestination && (
                <>
                  <LocationField
                    label={meta.originLabel}
                    value={origin}
                    placeholder={mode === 'cab' ? 'Enter pickup address' : 'City, station or airport'}
                    onChange={setOrigin}
                  />

                  <div className="hidden lg:flex items-center justify-center px-1">
                    <button
                      type="button"
                      onClick={swap}
                      aria-label="Swap origin and destination"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-900/10 bg-white text-ink-500 shadow-sm transition-transform hover:rotate-180 hover:border-signal-500 hover:text-signal-600 duration-300"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </button>
                  </div>

                  <LocationField
                    label={meta.destinationLabel}
                    value={destination}
                    placeholder={mode === 'cab' ? 'Enter drop address' : 'City, station or airport'}
                    onChange={setDestination}
                  />
                </>
              )}

              <DateField label="Departure" value={departDate} min={todayIso()} onChange={setDepartDate} />

              {mode === 'flight' ? (
                roundTrip ? (
                  <DateField label="Return" value={returnDate} min={departDate} onChange={setReturnDate} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setRoundTrip(true)}
                    className="flex flex-col justify-center rounded-lg px-3.5 py-3 text-left transition-colors hover:bg-ink-900/[0.03]"
                  >
                    <span className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Return</span>
                    <span className="text-[15px] font-semibold text-signal-600">+ Add return</span>
                  </button>
                )
              ) : (
                <div className="hidden lg:block" />
              )}

              <PassengerSelector
                value={passengers}
                onChange={setPassengers}
                travelClass={travelClass}
                onTravelClassChange={setTravelClass}
                classOptions={classOptions}
              />

              <div className="flex items-stretch p-1.5 lg:p-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSearch}
                  className="w-full lg:w-auto lg:px-6"
                >
                  <Search className="h-[18px] w-[18px]" strokeWidth={2} />
                  <span className="lg:hidden">Search {meta.label}s</span>
                </Button>
              </div>
            </div>

            {error && <p className="mt-3 rounded-lg bg-coral-400/10 px-3 py-2 text-xs font-medium text-coral-600" role="alert">{error}</p>}

            {mode === 'flight' && roundTrip && (
              <button
                type="button"
                onClick={() => {
                  setRoundTrip(false)
                  setReturnDate('')
                }}
                className="mt-1 px-3.5 text-xs font-medium text-ink-400 hover:text-coral-500"
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

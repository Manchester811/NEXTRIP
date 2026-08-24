import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { AlertTriangle, SearchX } from 'lucide-react'
import type { TransportMode, SearchParams as NextripSearchParams } from '@/types/transport'
import type { ResultFilters, SortKey, TripResult } from '@/types/results'
import { generateResults } from '@/data/mockResults'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { ResultsSearchBar } from '@/components/search/ResultsSearchBar'
import { SortBar } from '@/components/search/SortBar'
import { FilterPanel } from '@/components/search/FilterPanel'
import { ResultCard } from '@/components/transport/cards'
import { saveSelectedTrip } from '@/services/bookingStore'

const VALID_MODES: TransportMode[] = ['bus', 'train', 'flight', 'cab', 'metro', 'ferry']

function parseParams(sp: URLSearchParams): NextripSearchParams {
  const mode = (sp.get('mode') as TransportMode) ?? 'bus'
  return {
    mode: VALID_MODES.includes(mode) ? mode : 'bus',
    origin: sp.get('origin') ?? '',
    destination: sp.get('destination') ?? '',
    departDate: sp.get('date') ?? new Date().toISOString().slice(0, 10),
    returnDate: sp.get('return') ?? undefined,
    passengers: {
      adults: Number(sp.get('adults') ?? 1) || 1,
      children: Number(sp.get('children') ?? 0) || 0,
      infants: Number(sp.get('infants') ?? 0) || 0,
    },
    travelClass: sp.get('class') ?? undefined,
  }
}

const DEFAULT_FILTERS = (priceBounds: [number, number]): ResultFilters => ({
  priceRange: priceBounds,
  departureWindows: [],
  operators: [],
  minRating: 0,
  amenities: [],
  stops: 'any',
})

const windowOf = (departureTime: string) => {
  const [time, period] = departureTime.split(' ')
  let hour = Number(time.split(':')[0])
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  if (hour < 6) return 'early'
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'night'
}

export default function SearchResults() {
  const [sp] = useSearchParams()
  const navigate = useNavigate()
  const params = useMemo(() => parseParams(sp), [sp])

  const [loading, setLoading] = useState(true)
  const [allResults, setAllResults] = useState<TripResult[]>([])
  const [sort, setSort] = useState<SortKey>('recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<ResultFilters>(DEFAULT_FILTERS([0, 10000]))

  const missingInputs = !params.origin.trim() || !params.destination.trim()

  useEffect(() => {
    if (missingInputs) {
      setAllResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      const results = generateResults(params.mode, params.origin, params.destination)
      setAllResults(results)
      const prices = results.map((r) => r.price)
      const bounds: [number, number] = [Math.min(...prices), Math.max(...prices)]
      setFilters(DEFAULT_FILTERS(bounds))
      setLoading(false)
    }, 550)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.mode, params.origin, params.destination])

  const priceBounds = useMemo<[number, number]>(() => {
    if (allResults.length === 0) return [0, 10000]
    const prices = allResults.map((r) => r.price)
    return [Math.min(...prices), Math.max(...prices)]
  }, [allResults])

  const operators = useMemo(() => Array.from(new Set(allResults.map((r) => r.operator))), [allResults])
  const amenityOptions = useMemo(
    () => Array.from(new Set(allResults.flatMap((r) => r.amenities))).slice(0, 8),
    [allResults],
  )

  const filtered = useMemo(() => {
    let list = allResults.filter((r) => r.price >= filters.priceRange[0] && r.price <= filters.priceRange[1])
    if (filters.departureWindows.length > 0) {
      list = list.filter((r) => filters.departureWindows.includes(windowOf(r.departureTime)))
    }
    if (filters.operators.length > 0) {
      list = list.filter((r) => filters.operators.includes(r.operator))
    }
    if (filters.minRating > 0) {
      list = list.filter((r) => r.rating >= filters.minRating)
    }
    if (filters.amenities.length > 0) {
      list = list.filter((r) => filters.amenities.every((a) => r.amenities.includes(a)))
    }
    if (filters.stops === 'nonstop') {
      list = list.filter((r) => r.stops === 0)
    } else if (filters.stops === '1stop') {
      list = list.filter((r) => r.stops <= 1)
    }
    return list
  }, [allResults, filters])

  const sorted = useMemo(() => {
    const list = [...filtered]
    switch (sort) {
      case 'cheapest':
        return list.sort((a, b) => a.price - b.price)
      case 'fastest':
        return list.sort((a, b) => a.durationMinutes - b.durationMinutes)
      case 'earliest':
        return list.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      case 'rated':
        return list.sort((a, b) => b.rating - a.rating)
      default:
        return list.sort((a, b) => b.rating / 5 - a.price / priceBounds[1] * 0.3 - (a.rating / 5 - b.rating / 5))
    }
  }, [filtered, sort, priceBounds])

  const filterPanelProps = {
    filters,
    onChange: setFilters,
    operators,
    amenityOptions,
    priceBounds,
    showStops: params.mode === 'flight' || params.mode === 'train' || params.mode === 'ferry',
  }

  return (
    <div className="min-h-screen bg-paper-dim pb-20">
      <ResultsSearchBar params={params} />

      <Container className="mt-6">
        {missingInputs ? (
          <EmptyState
            icon={<SearchX className="h-6 w-6" />}
            title="Tell us where you're headed"
            body="Use “Modify search” above to add an origin and destination, then we'll find your options."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[268px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-xl border border-paper-line bg-white p-5">
                <p className="mb-4 font-display text-base font-semibold text-ink-950">Filters</p>
                <FilterPanel {...filterPanelProps} />
              </div>
            </aside>

            <div>
              <SortBar value={sort} onChange={setSort} resultCount={sorted.length} onOpenFilters={() => setFiltersOpen(true)} />

              <div className="mt-4 flex flex-col gap-3">
                {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

                {!loading && sorted.length === 0 && allResults.length > 0 && (
                  <EmptyState
                    icon={<SearchX className="h-6 w-6" />}
                    title="No trips match your filters"
                    body="Try widening your price range or clearing a few filters to see more options."
                    action={
                      <Button variant="outline" size="sm" onClick={() => setFilters(DEFAULT_FILTERS(priceBounds))}>
                        Clear filters
                      </Button>
                    }
                  />
                )}

                {!loading && allResults.length === 0 && !missingInputs && (
                  <EmptyState
                    icon={<AlertTriangle className="h-6 w-6" />}
                    title="We couldn't load results"
                    body="Something went wrong on our end. Please try searching again."
                    action={
                      <Button variant="outline" size="sm" onClick={() => navigate(0)}>
                        Retry
                      </Button>
                    }
                  />
                )}

                {!loading &&
                  sorted.map((trip, i) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i, 8) * 0.04, ease: 'easeOut' }}
                    >
                      <ResultCard trip={trip} onSelect={() => { saveSelectedTrip(trip); navigate(`/trip/${trip.id}`) }} />
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Container>

      <Drawer
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        title="Filters"
        footer={
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setFilters(DEFAULT_FILTERS(priceBounds))}>
              Clear all
            </Button>
            <Button variant="signal" className="flex-1" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} results
            </Button>
          </div>
        }
      >
        <FilterPanel {...filterPanelProps} />
      </Drawer>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-paper-line bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-1/3 rounded bg-ink-900/10" />
          <div className="h-3 w-1/4 rounded bg-ink-900/10" />
          <div className="h-4 w-2/3 rounded bg-ink-900/10" />
        </div>
        <div className="h-16 w-24 rounded bg-ink-900/10" />
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-900/15 bg-white px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/5 text-ink-500">{icon}</span>
      <p className="mt-4 font-display text-lg font-semibold text-ink-950">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

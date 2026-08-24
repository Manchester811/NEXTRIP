import { Route } from 'lucide-react'
import type { TripResult } from '@/types/results'
import { Card } from '@/components/ui/Card'

export function MetroCard({ trip, onSelect }: { trip: TripResult; onSelect?: () => void }) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-signal-50 text-signal-700">
          <Route className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-ink-950">{trip.metroLine}</p>
          <p className="mt-0.5 text-xs text-ink-400">{trip.stationsCount} stations · {trip.durationLabel}</p>
          <p className="mt-2 text-xs font-medium text-signal-700">{trip.nextDeparture}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
        <p className="font-display text-xl font-semibold text-ink-950">₹{trip.fare}</p>
        <button
          onClick={onSelect}
          className="rounded-full bg-signal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-signal-500"
        >
          View route
        </button>
      </div>
    </Card>
  )
}

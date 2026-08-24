import { Users } from 'lucide-react'
import type { TripResult } from '@/types/results'
import { Card } from '@/components/ui/Card'
import { RatingPill, PriceBlock } from './shared'

export function CabCard({ trip, onSelect }: { trip: TripResult; onSelect?: () => void }) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-signal-50 font-display text-sm font-semibold text-signal-700">
          {trip.cabType?.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink-950">{trip.cabType}</p>
            <RatingPill rating={trip.rating} reviewCount={trip.reviewCount} />
          </div>
          <p className="mt-0.5 text-xs text-ink-400">Partner driver · {trip.driverName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-ink-400" /> {trip.capacity} seats
            </span>
            <span>Pickup {trip.departureTime}</span>
            <span>Est. {trip.durationLabel}</span>
          </div>
        </div>
      </div>

      <PriceBlock price={trip.price} cta="Book cab" onSelect={onSelect} />
    </Card>
  )
}

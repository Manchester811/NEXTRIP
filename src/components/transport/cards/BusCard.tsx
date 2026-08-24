import type { TripResult } from '@/types/results'
import { Card } from '@/components/ui/Card'
import { AmenityRow, RatingPill, RouteTimeline, PriceBlock, cancellationTone } from './shared'

export function BusCard({ trip, onSelect }: { trip: TripResult; onSelect?: () => void }) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink-950">{trip.operator}</p>
            <RatingPill rating={trip.rating} reviewCount={trip.reviewCount} />
          </div>
          <p className="mt-0.5 text-xs text-ink-400">{trip.busType}</p>

          <div className="mt-3 max-w-sm">
            <RouteTimeline
              departureTime={trip.departureTime}
              arrivalTime={trip.arrivalTime}
              durationLabel={trip.durationLabel}
              stops={trip.stops}
            />
          </div>

          <p className="mt-2 text-xs text-ink-400">
            {trip.boardingPoint} → {trip.droppingPoint}
          </p>

          <AmenityRow amenities={trip.amenities} className="mt-3" />
          <p className={`mt-2 text-xs font-medium ${cancellationTone(trip.cancellation)}`}>{trip.cancellation}</p>
        </div>

        <PriceBlock price={trip.price} cta="View seats" onSelect={onSelect} seatsAvailable={trip.seatsAvailable} />
      </div>
    </Card>
  )
}

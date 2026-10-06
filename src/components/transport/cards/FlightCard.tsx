import type { TripResult } from '@/types/results'
import { Luggage } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { RatingPill, RouteTimeline, PriceBlock } from './shared'
import { cancellationTone } from '@/lib/cancellation'

export function FlightCard({ trip, onSelect }: { trip: TripResult; onSelect?: () => void }) {
  return (
    <Card className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink-950">{trip.operator}</p>
            <span className="font-mono text-xs text-ink-400">{trip.flightNumber}</span>
            <RatingPill rating={trip.rating} reviewCount={trip.reviewCount} />
          </div>
          <p className="mt-0.5 text-xs text-ink-400">{trip.cabinClass}</p>

          <div className="mt-3 max-w-sm">
            <RouteTimeline
              departureTime={trip.departureTime}
              arrivalTime={trip.arrivalTime}
              durationLabel={trip.durationLabel}
              stops={trip.stops}
            />
          </div>

          <p className="mt-2 text-xs text-ink-400">
            {trip.departureAirport} → {trip.arrivalAirport}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-500">
            <Luggage className="h-3.5 w-3.5 text-ink-400" />
            {trip.baggage}
          </div>
          <p className={`mt-2 text-xs font-medium ${cancellationTone(trip.cancellation)}`}>{trip.cancellation}</p>
        </div>

        <PriceBlock price={trip.price} cta="Select flight" onSelect={onSelect} seatsAvailable={trip.seatsAvailable} />
      </div>
    </Card>
  )
}

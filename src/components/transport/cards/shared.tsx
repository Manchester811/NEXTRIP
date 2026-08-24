import { Star, Wifi, BatteryCharging, Utensils, Tv, Wind, Shield, Sofa, Droplet } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { TripResult } from '@/types/results'

const AMENITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WiFi: Wifi,
  'Charging point': BatteryCharging,
  'Free meal': Utensils,
  Pantry: Utensils,
  'Pantry car': Utensils,
  'In-flight entertainment': Tv,
  'Air-conditioned': Wind,
  AC: Wind,
  'Sun deck': Sofa,
  'Life jackets': Shield,
  'Water bottle': Droplet,
}

export function AmenityRow({ amenities, className }: { amenities: string[]; className?: string }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-3 gap-y-1.5', className)}>
      {amenities.map((a) => {
        const Icon = AMENITY_ICONS[a]
        return (
          <span key={a} className="flex items-center gap-1 text-xs text-ink-500">
            {Icon ? <Icon className="h-3.5 w-3.5 text-ink-400" /> : <span className="h-1 w-1 rounded-full bg-ink-400" />}
            {a}
          </span>
        )
      })}
    </div>
  )
}

export function RatingPill({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  const tone = rating >= 4.3 ? 'signal' : rating >= 3.6 ? 'amber' : 'coral'
  return (
    <Badge variant={tone as 'signal' | 'amber' | 'coral'} className="gap-1">
      <Star className="h-3 w-3 fill-current" />
      {rating.toFixed(1)}
      <span className="font-normal opacity-70">({reviewCount})</span>
    </Badge>
  )
}

export function RouteTimeline({
  departureTime,
  arrivalTime,
  durationLabel,
  stops,
  stopsLabel,
}: {
  departureTime: string
  arrivalTime: string
  durationLabel: string
  stops: number
  stopsLabel?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-left">
        <p className="flap text-base font-semibold text-ink-950">{departureTime}</p>
      </div>
      <div className="flex flex-1 flex-col items-center px-1">
        <span className="text-[11px] text-ink-400">{durationLabel}</span>
        <div className="relative my-1 h-px w-full min-w-[48px] route-dotted" />
        <span className="text-[11px] text-ink-400">
          {stopsLabel ?? (stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`)}
        </span>
      </div>
      <div className="text-right">
        <p className="flap text-base font-semibold text-ink-950">{arrivalTime}</p>
      </div>
    </div>
  )
}

export function PriceBlock({
  price,
  cta,
  onSelect,
  seatsAvailable,
  seatsLabel = 'seats left',
}: {
  price: number
  cta: string
  onSelect?: () => void
  seatsAvailable?: number
  seatsLabel?: string
}) {
  return (
    <div className="flex shrink-0 flex-col items-end justify-between gap-3 sm:w-[132px]">
      <div className="text-right">
        <p className="font-display text-xl font-semibold text-ink-950">₹{price.toLocaleString('en-IN')}</p>
        {seatsAvailable !== undefined && (
          <p className={cn('text-[11px]', seatsAvailable <= 5 ? 'text-coral-600' : 'text-ink-400')}>
            {seatsAvailable} {seatsLabel}
          </p>
        )}
      </div>
      <button
        onClick={onSelect}
        className="w-full rounded-full bg-signal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-signal-500 sm:w-auto"
      >
        {cta}
      </button>
    </div>
  )
}

export function cancellationTone(c: TripResult['cancellation']) {
  if (c === 'Free cancellation') return 'text-signal-700'
  if (c === 'Partially refundable') return 'text-amber-600'
  return 'text-ink-400'
}

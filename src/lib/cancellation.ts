import type { TripResult } from '@/types/results'
export function cancellationTone(c: TripResult['cancellation']) {
  if (c === 'Free cancellation') return 'text-signal-700'
  if (c === 'Partially refundable') return 'text-amber-600'
  return 'text-ink-400'
}

import type { TripResult } from '@/types/results'
import { BusCard } from './BusCard'
import { TrainCard } from './TrainCard'
import { FlightCard } from './FlightCard'
import { CabCard } from './CabCard'
import { MetroCard } from './MetroCard'
import { FerryCard } from './FerryCard'

export function ResultCard({ trip, onSelect }: { trip: TripResult; onSelect?: () => void }) {
  switch (trip.mode) {
    case 'bus':
      return <BusCard trip={trip} onSelect={onSelect} />
    case 'train':
      return <TrainCard trip={trip} onSelect={onSelect} />
    case 'flight':
      return <FlightCard trip={trip} onSelect={onSelect} />
    case 'cab':
      return <CabCard trip={trip} onSelect={onSelect} />
    case 'metro':
      return <MetroCard trip={trip} onSelect={onSelect} />
    case 'ferry':
      return <FerryCard trip={trip} onSelect={onSelect} />
  }
}

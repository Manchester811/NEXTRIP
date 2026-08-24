import type { TransportMode } from './transport'

export type SortKey = 'recommended' | 'cheapest' | 'fastest' | 'earliest' | 'rated'

export interface TripResult {
  id: string
  mode: TransportMode
  operator: string
  price: number
  rating: number
  reviewCount: number
  departureTime: string // "06:30"
  arrivalTime: string // "12:40"
  durationLabel: string // "6h 10m"
  durationMinutes: number
  stops: number
  amenities: string[]
  cancellation: 'Free cancellation' | 'Partially refundable' | 'Non-refundable'
  seatsAvailable?: number

  // Bus
  busType?: string
  boardingPoint?: string
  droppingPoint?: string

  // Train
  trainName?: string
  trainNumber?: string
  travelClass?: string

  // Flight
  flightNumber?: string
  departureAirport?: string
  arrivalAirport?: string
  baggage?: string
  cabinClass?: string

  // Cab
  cabType?: string
  driverName?: string
  capacity?: number
  vehicleFeatures?: string[]

  // Metro
  metroLine?: string
  stationsCount?: number
  nextDeparture?: string
  fare?: number

  // Ferry
  departurePort?: string
  arrivalPort?: string
  seatingClass?: string
}

export interface ResultFilters {
  priceRange: [number, number]
  departureWindows: string[]
  operators: string[]
  minRating: number
  amenities: string[]
  stops: 'any' | 'nonstop' | '1stop'
}

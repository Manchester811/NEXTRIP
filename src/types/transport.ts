export type TransportMode = 'bus' | 'train' | 'flight' | 'cab' | 'metro' | 'ferry'

export interface TransportModeMeta {
  id: TransportMode
  label: string
  shortLabel: string
  originLabel: string
  destinationLabel: string
  icon: string // lucide icon name, resolved in ModeIcon
}

export interface PassengerCount {
  adults: number
  children: number
  infants: number
}

export interface SearchParams {
  mode: TransportMode
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  passengers: PassengerCount
  travelClass?: string
}

export interface Destination {
  id: string
  city: string
  country: string
  image: string
  fromPrice: number
  tag?: string
}

export interface PopularRoute {
  id: string
  origin: string
  destination: string
  mode: TransportMode
  fromPrice: number
  duration: string
  frequency: string
}

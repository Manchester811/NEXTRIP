import type { Destination, PopularRoute } from '@/types/transport'

export const POPULAR_DESTINATIONS: Destination[] = [
  { id: 'd1', city: 'Bengaluru', country: 'India', image: 'bengaluru', fromPrice: 899, tag: 'Trending' },
  { id: 'd2', city: 'Goa', country: 'India', image: 'goa', fromPrice: 2199, tag: 'Beach season' },
  { id: 'd3', city: 'Delhi', country: 'India', image: 'delhi', fromPrice: 1499 },
  { id: 'd4', city: 'Mumbai', country: 'India', image: 'mumbai', fromPrice: 1799 },
  { id: 'd5', city: 'Jaipur', country: 'India', image: 'jaipur', fromPrice: 1099, tag: 'Weekend pick' },
  { id: 'd6', city: 'Kochi', country: 'India', image: 'kochi', fromPrice: 2599 },
]

export const POPULAR_ROUTES: PopularRoute[] = [
  { id: 'r1', origin: 'Chennai', destination: 'Bengaluru', mode: 'bus', fromPrice: 599, duration: '6h 10m', frequency: '48 trips/day' },
  { id: 'r2', origin: 'Delhi', destination: 'Jaipur', mode: 'train', fromPrice: 449, duration: '4h 35m', frequency: '22 trains/day' },
  { id: 'r3', origin: 'Mumbai', destination: 'Goa', mode: 'flight', fromPrice: 2899, duration: '1h 15m', frequency: '14 flights/day' },
  { id: 'r4', origin: 'Kochi', destination: 'Alappuzha', mode: 'ferry', fromPrice: 199, duration: '2h 20m', frequency: '9 sailings/day' },
  { id: 'r5', origin: 'MG Road', destination: 'Whitefield', mode: 'metro', fromPrice: 45, duration: '38m', frequency: 'Every 5 min' },
  { id: 'r6', origin: 'Airport', destination: 'City Centre', mode: 'cab', fromPrice: 349, duration: '32m', frequency: 'On demand' },
]

export const DEPARTURE_BOARD_ROWS = [
  { code: 'NX 204', mode: 'flight' as const, route: 'DEL → BLR', time: '18:45', status: 'On time' },
  { code: 'NX B12', mode: 'bus' as const, route: 'CHN → BLR', time: '19:00', status: 'Boarding' },
  { code: 'NX T77', mode: 'train' as const, route: 'DEL → JAI', time: '19:20', status: 'On time' },
  { code: 'NX F03', mode: 'ferry' as const, route: 'KOC → ALP', time: '19:40', status: 'On time' },
  { code: 'NX M9', mode: 'metro' as const, route: 'MGR → WFD', time: '19:45', status: 'Every 5 min' },
]

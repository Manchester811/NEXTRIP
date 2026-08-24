import type { TransportMode } from '@/types/transport'
import type { TripResult } from '@/types/results'

// Simple deterministic PRNG so the same search always returns the same results.
function makeRng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

const pick = <T,>(rng: () => number, arr: T[]) => arr[Math.floor(rng() * arr.length)]
const between = (rng: () => number, min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min

const toClock = (minutesFromMidnight: number) => {
  const m = ((minutesFromMidnight % 1440) + 1440) % 1440
  const h = Math.floor(m / 60)
  const mm = m % 60
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${period}`
}

const toDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`

const AMENITIES: Record<TransportMode, string[]> = {
  bus: ['WiFi', 'Charging point', 'Blanket', 'Water bottle', 'Live tracking', 'CCTV'],
  train: ['Pantry car', 'Bedding', 'Charging point', 'Live tracking'],
  flight: ['Free meal', 'Extra legroom', 'In-flight entertainment', 'WiFi'],
  cab: ['AC', 'Music system', 'Phone charger', 'Sanitised'],
  metro: ['Air-conditioned', 'Wheelchair accessible', 'CCTV'],
  ferry: ['Sun deck', 'Cafeteria', 'Life jackets', 'AC lounge'],
}

const OPERATORS: Record<TransportMode, string[]> = {
  bus: ['Orange Travels', 'SilverLine Volvo', 'CityLink Express', 'Sundaram Coaches', 'BlueDart Bus'],
  train: ['Shatabdi Express', 'Rajdhani Express', 'Garib Rath', 'Duronto Express', 'Vande Bharat'],
  flight: ['IndSkies', 'Air Meridian', 'BlueWing Airlines', 'JetSpring', 'AeroNext'],
  cab: ['NEXTRIP Sedan', 'NEXTRIP SUV', 'NEXTRIP Prime', 'NEXTRIP Auto', 'NEXTRIP XL'],
  metro: ['Purple Line', 'Green Line', 'Blue Line', 'Yellow Line'],
  ferry: ['Coastal Cruises', 'Backwater Ferries', 'Island Link', 'Harbour Express'],
}

const BUS_TYPES = ['AC Sleeper', 'Non-AC Seater', 'AC Seater/Sleeper', 'Volvo Multi-Axle AC']
const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business']
const CAB_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Auto', 'Prime Sedan']
const CANCELLATION: TripResult['cancellation'][] = ['Free cancellation', 'Partially refundable', 'Non-refundable']

export function generateResults(
  mode: TransportMode,
  origin: string,
  destination: string,
  count = 12,
): TripResult[] {
  const rng = makeRng(`${mode}:${origin.toLowerCase()}:${destination.toLowerCase()}`)
  const results: TripResult[] = []

  for (let i = 0; i < count; i++) {
    const operator = pick(rng, OPERATORS[mode])
    const departureMinutes = between(rng, 0, 23) * 60 + pick(rng, [0, 15, 30, 45])
    const durationMinutes =
      mode === 'metro'
        ? between(rng, 20, 55)
        : mode === 'cab'
          ? between(rng, 15, 60)
          : mode === 'flight'
            ? between(rng, 60, 210)
            : between(rng, 180, 780)
    const arrivalMinutes = departureMinutes + durationMinutes
    const stops = mode === 'flight' || mode === 'ferry' ? between(rng, 0, 1) : mode === 'train' ? between(rng, 2, 9) : 0
    const basePrice =
      mode === 'flight'
        ? between(rng, 2400, 9800)
        : mode === 'train'
          ? between(rng, 350, 2400)
          : mode === 'bus'
            ? between(rng, 350, 1800)
            : mode === 'cab'
              ? between(rng, 180, 950)
              : mode === 'ferry'
                ? between(rng, 150, 1200)
                : between(rng, 20, 80)

    const base: TripResult = {
      id: `${mode}-${i}-${Math.round(rng() * 1e6)}`,
      mode,
      operator,
      price: basePrice,
      rating: Math.round((3.4 + rng() * 1.6) * 10) / 10,
      reviewCount: between(rng, 40, 4200),
      departureTime: toClock(departureMinutes),
      arrivalTime: toClock(arrivalMinutes),
      durationLabel: toDuration(durationMinutes),
      durationMinutes,
      stops,
      amenities: shuffleSample(rng, AMENITIES[mode], between(rng, 2, AMENITIES[mode].length)),
      cancellation: pick(rng, CANCELLATION),
      seatsAvailable: mode === 'metro' ? undefined : between(rng, 1, 40),
    }

    switch (mode) {
      case 'bus':
        base.busType = pick(rng, BUS_TYPES)
        base.boardingPoint = `${origin} — Main Bus Stand`
        base.droppingPoint = `${destination} — City Terminal`
        break
      case 'train':
        base.trainName = operator
        base.trainNumber = String(between(rng, 10000, 22999))
        base.travelClass = pick(rng, ['Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'AC First'])
        break
      case 'flight':
        base.flightNumber = `${operator.slice(0, 2).toUpperCase()} ${between(rng, 100, 999)}`
        base.departureAirport = `${origin} Airport`
        base.arrivalAirport = `${destination} Airport`
        base.baggage = pick(rng, ['15kg check-in + 7kg cabin', '20kg check-in + 7kg cabin', '7kg cabin only'])
        base.cabinClass = pick(rng, CABIN_CLASSES)
        break
      case 'cab':
        base.cabType = pick(rng, CAB_TYPES)
        base.driverName = pick(rng, ['Arun K.', 'Vikram S.', 'Ramesh P.', 'Suresh N.', 'Faisal M.'])
        base.capacity = base.cabType === 'SUV' ? 6 : base.cabType === 'Auto' ? 3 : 4
        base.vehicleFeatures = shuffleSample(rng, ['AC', 'Music', 'Charger', 'Sanitised'], 3)
        break
      case 'metro':
        base.metroLine = operator
        base.stationsCount = between(rng, 4, 14)
        base.nextDeparture = 'Every 4–6 min'
        base.fare = basePrice
        base.stops = base.stationsCount
        break
      case 'ferry':
        base.departurePort = `${origin} Port`
        base.arrivalPort = `${destination} Port`
        base.seatingClass = pick(rng, ['Deck', 'AC Seater', 'Cabin'])
        break
    }

    results.push(base)
  }

  return results
}

function shuffleSample<T>(rng: () => number, arr: T[], n: number): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(n, copy.length))
}

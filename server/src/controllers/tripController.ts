import { Request, Response } from 'express'
import { prisma } from '../utils/prisma.js'
import { AppError } from '../middleware/errorHandler.js'
import { AuthRequest } from '../middleware/auth.js'

interface TripSearchParams {
  mode: string
  origin: string
  destination: string
  departDate: string
  returnDate?: string
  adults?: string
  children?: string
  infants?: string
  travelClass?: string
}

const toDateTime = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, minute] = timeStr.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute)
}

const generateMockTrips = (params: TripSearchParams): any[] => {
  const { mode, origin, destination, departDate, adults = '1', children = '0', infants = '0' } = params
  const totalPassengers = Number(adults) + Number(children) + Number(infants)
  const seed = `${mode}:${origin.toLowerCase()}:${destination.toLowerCase()}:${departDate}`
  
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  const rng = () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
  
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)]
  const between = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min
  const toClock = (mins: number) => {
    const m = ((mins % 1440) + 1440) % 1440
    const h = Math.floor(m / 60)
    const mm = m % 60
    const period = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 === 0 ? 12 : h % 12
    return `${h12}:${String(mm).padStart(2, '0')} ${period}`
  }
  const toDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`
  const shuffleSample = <T,>(arr: T[], n: number) => {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy.slice(0, Math.min(n, copy.length))
  }

  const AMENITIES: Record<string, string[]> = {
    bus: ['WiFi', 'Charging point', 'Blanket', 'Water bottle', 'Live tracking', 'CCTV'],
    train: ['Pantry car', 'Bedding', 'Charging point', 'Live tracking'],
    flight: ['Free meal', 'Extra legroom', 'In-flight entertainment', 'WiFi'],
    cab: ['AC', 'Music system', 'Phone charger', 'Sanitised'],
    metro: ['Air-conditioned', 'Wheelchair accessible', 'CCTV'],
    ferry: ['Sun deck', 'Cafeteria', 'Life jackets', 'AC lounge'],
  }

  const OPERATORS: Record<string, string[]> = {
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
  const CANCELLATION = ['Free cancellation', 'Partially refundable', 'Non-refundable']

  const results = []
  for (let i = 0; i < 12; i++) {
    const operator = pick(OPERATORS[mode])
    const departureMinutes = between(0, 23) * 60 + pick([0, 15, 30, 45])
    const durationMinutes =
      mode === 'metro' ? between(20, 55)
      : mode === 'cab' ? between(15, 60)
      : mode === 'flight' ? between(60, 210)
      : between(180, 780)
    const arrivalMinutes = departureMinutes + durationMinutes
    const stops = mode === 'flight' || mode === 'ferry' ? between(0, 1) : mode === 'train' ? between(2, 9) : 0
    const basePrice =
      mode === 'flight' ? between(2400, 9800)
      : mode === 'train' ? between(350, 2400)
      : mode === 'bus' ? between(350, 1800)
      : mode === 'cab' ? between(180, 950)
      : mode === 'ferry' ? between(150, 1200)
      : between(20, 80)

    const base = {
      id: `${mode}-${i}-${Math.round(rng() * 1e6)}`,
      mode,
      operator,
      price: basePrice,
      rating: Math.round((3.4 + rng() * 1.6) * 10) / 10,
      reviewCount: between(40, 4200),
      departureTime: toClock(departureMinutes),
      arrivalTime: toClock(arrivalMinutes),
      durationLabel: toDuration(durationMinutes),
      durationMinutes,
      stops,
      amenities: shuffleSample(AMENITIES[mode], between(2, AMENITIES[mode].length)),
      cancellation: pick(CANCELLATION),
      seatsAvailable: mode === 'metro' ? undefined : between(1, 40),
      origin,
      destination,
    }

    switch (mode) {
      case 'bus':
        base.busType = pick(BUS_TYPES)
        base.boardingPoint = `${origin} — Main Bus Stand`
        base.droppingPoint = `${destination} — City Terminal`
        break
      case 'train':
        base.trainName = operator
        base.trainNumber = String(between(10000, 22999))
        base.travelClass = pick(['Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'AC First'])
        break
      case 'flight':
        base.flightNumber = `${operator.slice(0, 2).toUpperCase()} ${between(100, 999)}`
        base.departureAirport = `${origin} Airport`
        base.arrivalAirport = `${destination} Airport`
        base.baggage = pick(['15kg check-in + 7kg cabin', '20kg check-in + 7kg cabin', '7kg cabin only'])
        base.cabinClass = pick(CABIN_CLASSES)
        break
      case 'cab':
        base.cabType = pick(CAB_TYPES)
        base.driverName = pick(['Arun K.', 'Vikram S.', 'Ramesh P.', 'Suresh N.', 'Faisal M.'])
        base.capacity = base.cabType === 'SUV' ? 6 : base.cabType === 'Auto' ? 3 : 4
        base.vehicleFeatures = shuffleSample(['AC', 'Music', 'Charger', 'Sanitised'], 3).join(',')
        break
      case 'metro':
        base.metroLine = operator
        base.stationsCount = between(4, 14)
        base.nextDeparture = 'Every 4–6 min'
        base.fare = basePrice
        base.stops = base.stationsCount
        break
      case 'ferry':
        base.departurePort = `${origin} Port`
        base.arrivalPort = `${destination} Port`
        base.seatingClass = pick(['Deck', 'AC Seater', 'Cabin'])
        break
    }

    const departDateTime = toDateTime(departDate, base.departureTime)
    results.push({
      ...base,
      departDate: departDateTime,
    })
  }

  return results
}

export async function searchTrips(req: Request, res: Response) {
  const params = req.query as TripSearchParams
  
  if (!params.mode || !params.origin || !params.destination || !params.departDate) {
    throw new AppError(400, 'Missing required search parameters')
  }

  let trips = await prisma.trip.findMany({
    where: {
      mode: params.mode as any,
      origin: { equals: params.origin, mode: 'insensitive' },
      destination: { equals: params.destination, mode: 'insensitive' },
      departDate: {
        gte: new Date(params.departDate + 'T00:00:00'),
        lt: new Date(params.departDate + 'T23:59:59'),
      },
      seatsAvailable: { gt: 0 },
    },
    take: 50,
    orderBy: { departureTime: 'asc' },
  })

  if (trips.length === 0) {
    trips = generateMockTrips(params)
  }

  res.json({ trips, total: trips.length })
}

export async function getTrip(req: Request, res: Response) {
  const { id } = req.params
  const trip = await prisma.trip.findUnique({ where: { id } })
  if (!trip) throw new AppError(404, 'Trip not found')
  res.json({ trip })
}

export async function getPopularRoutes(req: Request, res: Response) {
  const routes = await prisma.trip.groupBy({
    by: ['origin', 'destination', 'mode'],
    _count: { id: true },
    _min: { price: true },
    _avg: { rating: true },
    orderBy: { _count: { id: 'desc' } },
    take: 20,
  })

  const formatted = routes.map(r => ({
    origin: r.origin,
    destination: r.destination,
    mode: r.mode,
    tripCount: r._count.id,
    fromPrice: r._min.price ?? 0,
    avgRating: r._avg.rating ?? 0,
  }))

  res.json({ routes: formatted })
}
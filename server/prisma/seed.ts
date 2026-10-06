import { PrismaClient, TransportMode, CancellationPolicy } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const CITIES = [
  'Vellore', 'Chennai', 'Bangalore', 'Coimbatore', 'Madurai', 'Salem',
  'Tiruchirappalli', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi',
  'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam'
]

const MODES = ['bus', 'train', 'flight', 'cab', 'metro', 'ferry']
const CANCELLATIONS = ['FREE', 'PARTIAL', 'NON_REFUNDABLE']

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.searchLog.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await bcrypt.hash('password123', 12)

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@nextrip.com',
      name: 'Demo Traveller',
      passwordHash,
    },
  })

  console.log(`✅ Created demo user: ${demoUser.email}`)

  const tripsToCreate = []
  const today = new Date()
  
  for (let day = 0; day < 7; day++) {
    const departDate = new Date(today)
    departDate.setDate(today.getDate() + day)
    departDate.setHours(0, 0, 0, 0)

    for (const origin of CITIES.slice(0, 5)) {
      for (const destination of CITIES.slice(0, 5)) {
        if (origin === destination) continue

        for (const mode of MODES) {
          const count = mode === 'metro' ? 4 : 6
          
          for (let i = 0; i < count; i++) {
            const seed = `${mode}:${origin.toLowerCase()}:${destination.toLowerCase()}:${departDate.toISOString().split('T')[0]}:${i}`
            let h = 1779033703 ^ seed.length
            for (let j = 0; j < seed.length; j++) {
              h = Math.imul(h ^ seed.charCodeAt(j), 3432918353)
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

            const tripData: any = {
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
              amenities: JSON.stringify(shuffleSample(AMENITIES[mode], between(2, AMENITIES[mode].length))),
              cancellation: pick(CANCELLATIONS),
              seatsAvailable: mode === 'metro' ? null : between(1, 40),
              origin,
              destination,
              departDate,
            }

            switch (mode) {
              case 'bus':
                tripData.busType = pick(BUS_TYPES)
                tripData.boardingPoint = `${origin} — Main Bus Stand`
                tripData.droppingPoint = `${destination} — City Terminal`
                break
              case 'train':
                tripData.trainName = operator
                tripData.trainNumber = String(between(10000, 22999))
                tripData.travelClass = pick(['Sleeper', 'AC 3-Tier', 'AC 2-Tier', 'AC First'])
                break
              case 'flight':
                tripData.flightNumber = `${operator.slice(0, 2).toUpperCase()} ${between(100, 999)}`
                tripData.departureAirport = `${origin} Airport`
                tripData.arrivalAirport = `${destination} Airport`
                tripData.baggage = pick(['15kg check-in + 7kg cabin', '20kg check-in + 7kg cabin', '7kg cabin only'])
                tripData.cabinClass = pick(CABIN_CLASSES)
                break
              case 'cab':
                tripData.cabType = pick(CAB_TYPES)
                tripData.driverName = pick(['Arun K.', 'Vikram S.', 'Ramesh P.', 'Suresh N.', 'Faisal M.'])
                tripData.capacity = tripData.cabType === 'SUV' ? 6 : tripData.cabType === 'Auto' ? 3 : 4
                tripData.vehicleFeatures = JSON.stringify(shuffleSample(['AC', 'Music', 'Charger', 'Sanitised'], 3))
                break
              case 'metro':
                tripData.metroLine = operator
                tripData.stationsCount = between(4, 14)
                tripData.nextDeparture = 'Every 4–6 min'
                tripData.fare = basePrice
                tripData.stops = tripData.stationsCount
                break
              case 'ferry':
                tripData.departurePort = `${origin} Port`
                tripData.arrivalPort = `${destination} Port`
                tripData.seatingClass = pick(['Deck', 'AC Seater', 'Cabin'])
                break
            }

            tripsToCreate.push(tripData)
          }
        }
      }
    }
  }

  console.log(`📦 Creating ${tripsToCreate.length} trips...`)
  await prisma.trip.createMany({ data: tripsToCreate })
  console.log('✅ Trips created')

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
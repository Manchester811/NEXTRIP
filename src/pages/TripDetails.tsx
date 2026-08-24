import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Clock3, MapPin, ShieldCheck, Star, Wifi, Utensils, Zap } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ModeIcon } from '@/components/transport/ModeIcon'
import { AmenityRow, RouteTimeline } from '@/components/transport/cards/shared'
import { getSelectedTrip, saveSelectedTrip } from '@/services/bookingStore'
import { generateResults } from '@/data/mockResults'
import type { TransportMode } from '@/types/transport'

function fallbackTrip(id: string) {
  const mode = (['bus', 'train', 'flight', 'cab', 'metro', 'ferry'] as TransportMode[]).find((m) => id.startsWith(`${m}-`)) ?? 'bus'
  return generateResults(mode, 'New Delhi', 'Mumbai', 12)[0]
}

export default function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = useMemo(() => {
    const selected = getSelectedTrip()
    return selected?.id === id ? selected : fallbackTrip(id ?? 'bus-0')
  }, [id])

  const handleContinue = () => {
    saveSelectedTrip(trip)
    navigate(`/seat-selection/${trip.id}`)
  }

  return (
    <div className="min-h-screen bg-paper-dim pb-20">
      <Container className="pt-7">
        <Link to="/search" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-950">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="overflow-hidden">
                <div className="bg-ink-950 p-6 text-white sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                        <ModeIcon mode={trip.mode} className="h-5 w-5 text-signal-300" />
                      </span>
                      <div>
                        <p className="font-display text-xl font-semibold">{trip.operator}</p>
                        <p className="text-sm text-white/50">{trip.mode.toUpperCase()} · {trip.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                    <Badge variant="outline-light"><Star className="h-3 w-3 fill-current" /> {trip.rating.toFixed(1)} · {trip.reviewCount} reviews</Badge>
                  </div>

                  <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <p className="flap text-3xl font-semibold">{trip.departureTime}</p>
                      <p className="mt-1 text-sm text-white/55">{trip.boardingPoint ?? trip.departureAirport ?? 'Departure point'}</p>
                    </div>
                    <div className="flex min-w-[110px] flex-col items-center gap-2 text-white/40">
                      <Clock3 className="h-4 w-4" />
                      <span className="h-px w-full bg-white/15" />
                      <span className="font-mono text-[11px]">{trip.durationLabel}</span>
                    </div>
                    <div className="text-right">
                      <p className="flap text-3xl font-semibold">{trip.arrivalTime}</p>
                      <p className="mt-1 text-sm text-white/55">{trip.droppingPoint ?? trip.arrivalAirport ?? 'Arrival point'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-6 sm:grid-cols-3">
                  <Info label="Route" value={`${trip.boardingPoint ?? trip.departureAirport ?? 'Origin'} → ${trip.droppingPoint ?? trip.arrivalAirport ?? 'Destination'}`} icon={MapPin} />
                  <Info label="Cancellation" value={trip.cancellation} icon={ShieldCheck} />
                  <Info label="Availability" value={trip.seatsAvailable ? `${trip.seatsAvailable} seats remaining` : 'Frequent service'} icon={Zap} />
                </div>
              </Card>
            </motion.div>

            <Card className="p-6 sm:p-7">
              <SectionTitle title="Journey details" />
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <RouteTimeline departureTime={trip.departureTime} arrivalTime={trip.arrivalTime} durationLabel={trip.durationLabel} stops={trip.stops} />
                <div className="rounded-xl bg-paper-dim p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">Service</p>
                  <p className="mt-2 font-display text-lg font-semibold text-ink-950">{trip.busType ?? trip.travelClass ?? trip.cabinClass ?? trip.cabType ?? trip.seatingClass ?? trip.metroLine}</p>
                  <p className="mt-1 text-sm text-ink-500">Reliable, verified and bookable through NEXTRIP.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-7">
              <SectionTitle title="Amenities" />
              <AmenityRow amenities={trip.amenities} className="mt-5" />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <MiniFeature icon={Wifi} title="Connected" text="Live trip updates" />
                <MiniFeature icon={Utensils} title="Comfort" text="Verified amenities" />
                <MiniFeature icon={ShieldCheck} title="Protected" text="Secure booking" />
              </div>
            </Card>
          </div>

          <aside>
            <Card className="sticky top-24 overflow-hidden">
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Your fare</p>
                <p className="mt-2 font-display text-3xl font-semibold text-ink-950">₹{trip.price.toLocaleString('en-IN')}</p>
                <p className="mt-1 text-sm text-ink-400">per traveller · taxes included</p>

                <div className="my-6 space-y-3 border-y border-paper-line py-5 text-sm">
                  <Row label="Base fare" value={`₹${Math.round(trip.price * 0.88).toLocaleString('en-IN')}`} />
                  <Row label="Service fee" value={`₹${Math.round(trip.price * 0.07).toLocaleString('en-IN')}`} />
                  <Row label="Taxes" value={`₹${Math.max(0, trip.price - Math.round(trip.price * 0.95)).toLocaleString('en-IN')}`} />
                </div>

                <Button variant="primary" size="lg" className="w-full" onClick={handleContinue}>
                  Continue to seats <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="mt-3 text-center text-xs text-ink-400">No payment is taken until you confirm.</p>
              </div>
            </Card>
          </aside>
        </div>
      </Container>
    </div>
  )
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: typeof MapPin }) {
  return <div className="flex gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" /><div><p className="text-xs text-ink-400">{label}</p><p className="mt-1 text-sm font-medium text-ink-900">{value}</p></div></div>
}
function SectionTitle({ title }: { title: string }) { return <h2 className="font-display text-xl font-semibold text-ink-950">{title}</h2> }
function MiniFeature({ icon: Icon, title, text }: { icon: typeof Wifi; title: string; text: string }) { return <div className="rounded-xl border border-paper-line p-4"><Icon className="h-4 w-4 text-signal-600" /><p className="mt-3 text-sm font-semibold text-ink-950">{title}</p><p className="mt-1 text-xs text-ink-400">{text}</p></div> }
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><span className="text-ink-500">{label}</span><span className="font-medium text-ink-950">{value}</span></div> }

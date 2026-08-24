import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, DoorOpen, Info } from 'lucide-react'
import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getSelectedTrip, saveSelectedTrip } from '@/services/bookingStore'
import { generateResults } from '@/data/mockResults'
import type { TransportMode } from '@/types/transport'

const seats = Array.from({ length: 32 }, (_, i) => `S${i + 1}`)

export default function SeatSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = useMemo(() => getSelectedTrip()?.id === id ? getSelectedTrip() : generateResults('bus', 'New Delhi', 'Mumbai', 1)[0], [id])
  const [selected, setSelected] = useState<string[]>([])
  const occupied = useMemo(() => new Set(['S3', 'S7', 'S12', 'S18', 'S21', 'S29']), [])
  const mode = trip?.mode as TransportMode
  const seatPrice = trip ? Math.max(50, Math.round(trip.price / 6)) : 100

  if (!trip) return null

  const toggle = (seat: string) => {
    if (occupied.has(seat)) return
    setSelected((current) => current.includes(seat) ? current.filter((s) => s !== seat) : current.length < trip.seatsAvailable! ? [...current, seat] : current)
  }

  const continueToPassenger = () => {
    saveSelectedTrip(trip)
    sessionStorage.setItem('nextrip:selected-seats', JSON.stringify(selected))
    navigate('/passenger-details')
  }

  return (
    <div className="min-h-screen bg-paper-dim pb-20">
      <Container className="pt-7">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-950"><ArrowLeft className="h-4 w-4" /> Back</button>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-paper-line pb-5">
              <div><Badge variant="signal">{mode.toUpperCase()}</Badge><h1 className="mt-3 font-display text-2xl font-semibold text-ink-950">Choose your seats</h1><p className="mt-1 text-sm text-ink-500">{trip.operator} · {trip.departureTime} → {trip.arrivalTime}</p></div>
              <div className="rounded-xl bg-paper-dim px-4 py-3 text-right"><p className="text-xs text-ink-400">Selected</p><p className="font-display text-xl font-semibold">{selected.length}</p></div>
            </div>

            <div className="mt-7 flex flex-wrap gap-4 text-xs text-ink-500">
              <Legend tone="available" label="Available" /><Legend tone="selected" label="Selected" /><Legend tone="occupied" label="Occupied" />
            </div>

            <div className="mx-auto mt-8 max-w-[430px] rounded-[32px] border-2 border-ink-900/10 bg-paper-dim p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between rounded-2xl bg-ink-950 px-4 py-3 text-white"><span className="text-xs uppercase tracking-[0.15em] text-white/50">Front</span><DoorOpen className="h-4 w-4 text-signal-300" /></div>
              <div className="grid grid-cols-4 gap-3">
                {seats.map((seat, index) => {
                  const isOccupied = occupied.has(seat)
                  const isSelected = selected.includes(seat)
                  const aisle = index % 4 === 1
                  return <motion.button key={seat} type="button" disabled={isOccupied} onClick={() => toggle(seat)} whileTap={{ scale: 0.94 }} className={`relative h-12 rounded-xl border text-xs font-semibold transition-colors ${aisle ? 'mr-2' : ''} ${isOccupied ? 'cursor-not-allowed border-ink-900/5 bg-ink-900/10 text-ink-300' : isSelected ? 'border-signal-600 bg-signal-600 text-white shadow-lg shadow-signal-600/20' : 'border-paper-line bg-white text-ink-700 hover:border-signal-300 hover:bg-signal-50'}`} aria-label={`${seat}${isOccupied ? ' occupied' : isSelected ? ' selected' : ' available'}`}><span>{seat}</span>{isSelected && <Check className="absolute right-1.5 top-1.5 h-3 w-3" />}</motion.button>
                })}
              </div>
              <div className="mt-6 rounded-2xl border border-dashed border-ink-900/15 bg-white/60 p-4 text-center text-xs text-ink-400">Rear · emergency exit</div>
            </div>
          </Card>

          <aside><Card className="sticky top-24 p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Trip summary</p><p className="mt-2 font-display text-xl font-semibold">{trip.operator}</p><p className="mt-1 text-sm text-ink-500">{trip.departureTime} → {trip.arrivalTime}</p><div className="my-5 border-y border-paper-line py-5 text-sm"><div className="flex justify-between"><span className="text-ink-500">Seats</span><span className="font-medium">{selected.join(', ') || 'None'}</span></div><div className="mt-3 flex justify-between"><span className="text-ink-500">Seat fare</span><span className="font-medium">₹{(seatPrice * selected.length).toLocaleString('en-IN')}</span></div></div><div className="flex items-start gap-2 rounded-xl bg-signal-50 p-3 text-xs text-signal-900"><Info className="mt-0.5 h-4 w-4 shrink-0" />Select seats together when possible for a better experience.</div><Button variant="primary" size="lg" className="mt-5 w-full" disabled={!selected.length} onClick={continueToPassenger}>Continue <ArrowRight className="h-4 w-4" /></Button></Card></aside>
        </div>
      </Container>
    </div>
  )
}

function Legend({ tone, label }: { tone: 'available' | 'selected' | 'occupied'; label: string }) { const styles = { available: 'bg-white border-paper-line', selected: 'bg-signal-600 border-signal-600', occupied: 'bg-ink-900/10 border-ink-900/5' }; return <span className="flex items-center gap-2"><span className={`h-3.5 w-3.5 rounded border ${styles[tone]}`} />{label}</span> }

import { ArrowLeft, ArrowRight, MapPin, ShieldCheck, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getSelectedTrip, saveSelectedTrip } from '@/services/bookingStore'
import { generateResults } from '@/data/mockResults'

function fallbackTrip(id: string) {
  const mode = ['bus','train','flight','cab','metro','ferry'].includes(id.split('-')[0] ?? '') ? id.split('-')[0] : 'bus'
  return generateResults(mode as any, 'Vellore', 'Chennai', 12)[0]
}

export default function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trip = (() => {
    const selected = getSelectedTrip()
    return (selected && selected.id === id) ? selected : fallbackTrip(id ?? 'bus-0')
  })()

  const handleContinue = () => { saveSelectedTrip(trip); navigate(`/seat-selection/${trip.id}`) }

  return (
    <main className="min-h-screen bg-[#030B16] pb-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pt-24 pb-12">
        <Link to="/search" className="inline-flex items-center gap-2 text-sm font-medium text-[#8B98A8] hover:text-[#F5F7FA] transition-colors mb-6"><ArrowLeft className="h-4 w-4" /> Back to results</Link>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-12">
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="rounded-[28px] bg-[#091A2B] border border-white/[0.07] overflow-hidden">
                <div className="bg-gradient-to-br from-[#091A2B] to-[#071525] p-8 lg:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-display text-xl font-bold text-[#F5F7FA]">{trip.operator}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.08] text-[#8B98A8]">{trip.mode?.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                      <div className="font-display text-4xl font-bold text-[#F5F7FA] leading-none">{trip.departureTime ?? '08:30'}</div>
                      <div className="text-sm text-[#8B98A8] mt-2">Vellore</div>
                    </div>
                    <div className="flex flex-col items-center px-4 gap-2">
                      <div className="text-xs text-[#8B98A8] font-medium">{trip.durationLabel ?? '3h 20m'}</div>
                      <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/40 to-transparent" />
                      <ArrowRight className="h-5 w-5 text-[#8B98A8] rotate-90 lg:rotate-0" />
                    </div>
                    <div className="text-right">
                      <div className="font-display text-4xl font-bold text-[#F5F7FA] leading-none">{trip.arrivalTime ?? '11:50'}</div>
                      <div className="text-sm text-[#8B98A8] mt-2">Chennai</div>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 p-6 lg:p-8 border-t border-white/[0.07]">
                  <Info label="Route" value="Vellore → Chennai" icon={MapPin} />
                  <Info label="Cancellation" value={trip.cancellation ?? 'Free up to 4h before'} icon={ShieldCheck} />
                  <Info label="Class" value={trip.travelClass ?? 'AC Seater'} icon={Star} />
                </div>
              </div>
            </motion.div>
          </div>

          <aside className="lg:pt-2">
            <div className="rounded-[28px] bg-[#091A2B] border border-white/[0.07] p-7 lg:p-8 sticky top-28">
              <h3 className="font-display text-2xl font-bold text-[#F5F7FA] mb-2">Booking Summary</h3>
              <p className="text-sm text-[#8B98A8] mb-6">Review details before continuing.</p>
              <div className="space-y-4 mb-8">
                <Row label="Journey" value={`${trip.departurePort ?? trip.boardingPoint ?? 'Vellore'} → ${trip.droppingPoint ?? trip.arrivalPort ?? 'Chennai'}`} />
                <Row label="Date" value={(trip as any).date ?? '12 Oct 2026'} />
                <Row label="Departure" value={trip.departureTime ?? '08:30 AM'} />
                <Row label="Arrival" value={trip.arrivalTime ?? '11:50 AM'} />
                <Row label="Passenger" value="Rishabh Jain" />
                <Row label="Operator" value={trip.operator} />
                <Row label="Category" value={trip.travelClass ?? 'AC Seater'} />
                <div className="h-px bg-white/[0.07]" />
                <Row label="Price" value={`₹${trip.price ?? 450}`} highlight />
              </div>
              <button onClick={handleContinue} className="w-full rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white font-semibold px-6 py-4 text-lg shadow-[0_8px_30px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Continue <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-white/[0.05] flex items-center justify-center text-[#3B82F6]"><Icon className="h-4 w-4" strokeWidth={1.5} /></div>
      <div>
        <div className="text-xs text-[#8B98A8]">{label}</div>
        <div className="text-sm font-medium text-[#F5F7FA]">{value}</div>
      </div>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[#8B98A8]">{label}</span>
      <span className={highlight ? 'font-display text-lg font-bold text-[#F5F7FA]' : 'text-[#F5F7FA] font-medium'}>{value}</span>
    </div>
  )
}

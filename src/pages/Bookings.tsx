import { useState, useMemo } from 'react'
import { Ticket, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { cancelBooking, getBookings } from '@/services/bookingStore'

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
] as const

export default function Bookings() {
  const [bookings, setBookings] = useState(getBookings())
  const [tab, setTab] = useState('all')

  const visible = useMemo(() => {
    if (tab === 'all') return bookings
    return bookings.filter((b: any) => b.status?.toLowerCase() === tab)
  }, [bookings, tab])

  const handleCancel = (id: string) => {
    if (!window.confirm('Cancel this booking?')) return
    cancelBooking(id)
    setBookings(getBookings())
  }

  return (
    <main className="min-h-screen bg-[#030B16] pb-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pt-24 pb-10">
        <h1 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] text-[#F5F7FA] leading-tight mb-3">My bookings</h1>
        <p className="text-[#8B98A8] text-lg max-w-xl">Your upcoming and previous journeys.</p>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pb-24">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-[#3B82F6] text-white shadow-[0_2px_10px_rgba(59,130,246,0.35)]' : 'bg-white/[0.05] text-[#8B98A8] hover:text-[#F5F7FA] hover:bg-white/[0.08]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-[28px] bg-[#091A2B] border border-white/[0.07] p-16 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-6"><Ticket className="h-7 w-7 text-[#8B98A8]" /></div>
            <h2 className="font-display text-2xl font-bold text-[#F5F7FA] mb-2">No bookings yet</h2>
            <p className="text-[#8B98A8] mb-6">Your confirmed journeys will appear here after you complete a booking.</p>
            <Link to="/search" className="inline-flex items-center gap-2 rounded-2xl bg-[#3B82F6] text-white font-semibold px-6 py-3 hover:bg-[#2563EB] transition-colors">Find a trip <ChevronRight className="h-4 w-4" /></Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((b: any, i: number) => (
              <motion.article
                key={b.id || b.bookingId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-[28px] bg-[#091A2B] border border-white/[0.07] p-7 hover:border-white/[0.14] transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${b.status === 'CONFIRMED' ? 'bg-[#10B981]/10 text-[#10B981]' : b.status === 'COMPLETED' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>{b.status || 'CONFIRMED'}</span>
                  <span className="text-xs text-[#8B98A8] font-mono">{b.bookingId || b.id}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#F5F7FA] mb-1">{b.route || `${b.origin} → ${b.destination}`}</h3>
                <p className="text-sm text-[#8B98A8] mb-4">{b.date || '12 Oct 2026'} · {b.time || '08:30 AM'}</p>
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <Info label="Operator" value={b.operator || 'ACME Travels'} />
                  <Info label="Seat" value={b.seat || '24A'} />
                  <Info label="Price" value={`₹${b.price || 450}`} />
                </div>
                <div className="flex gap-2">
                  <Link to={`/booking-details/${b.id || b.bookingId}`} className="flex-1 text-center rounded-xl border border-white/[0.10] px-3 py-2.5 text-sm font-medium text-[#F5F7FA] hover:bg-white/[0.05] transition-colors">View ticket</Link>
                  {b.status !== 'CANCELLED' && <button onClick={() => handleCancel(b.id || b.bookingId)} className="flex-1 text-center rounded-xl border border-white/[0.10] px-3 py-2.5 text-sm font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors">Cancel</button>}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs text-[#8B98A8]">{label}</div><div className="font-medium text-[#F5F7FA]">{value}</div></div>
}

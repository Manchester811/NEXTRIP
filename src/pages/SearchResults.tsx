import { ArrowRight, Filter, ArrowUpDown, ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { TRANSPORT_MODES } from '@/data/modes'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'bus'
  const origin = searchParams.get('origin') || 'Vellore'
  const destination = searchParams.get('destination') || 'Chennai'
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 10)
  const adults = searchParams.get('adults') || '1'
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  const meta = TRANSPORT_MODES.find(m => m.id === mode) || TRANSPORT_MODES[0]
  void meta

  // Real mock results from project data
  const results = [
    { id: 't1', operator: 'ACME Travels', dep: '08:30', arr: '11:50', from: origin, to: destination, duration: '3h 20m', price: 450, seats: 24, direct: true, category: 'AC Seater' },
    { id: 't2', operator: 'Sri Ganesh Transport', dep: '10:15', arr: '13:40', from: origin, to: destination, duration: '3h 25m', price: 520, seats: 8, direct: true, category: 'Sleeper' },
    { id: 't3', operator: 'KSR Tours', dep: '13:00', arr: '16:45', from: origin, to: destination, duration: '3h 45m', price: 390, seats: 18, direct: false, category: 'Non-AC' },
  ]

  return (
    <main className="min-h-screen bg-[#030B16]">
      {/* Header */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pt-20 pb-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#8B98A8] mb-2">
          <a href="/" className="hover:text-[#F5F7FA] transition-colors">Home</a>
          <ArrowRight className="h-3 w-3" />
          <a href="/search" className="hover:text-[#F5F7FA] transition-colors">Search</a>
        </div>
        <h1 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] text-[#F5F7FA] leading-tight">
          Search Results
        </h1>
        <p className="mt-3 text-[#8B98A8] text-lg">
          {origin} → {destination} · {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })} · {adults} Passengers
        </p>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pb-24 lg:pb-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Filters sidebar */}
          <aside className="lg:col-span-3">
            <div className="rounded-3xl bg-[#091A2B] border border-white/[0.07] p-6 lg:p-7 sticky top-28">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-4 w-4 text-[#3B82F6]" />
                <h3 className="font-display text-xl font-semibold text-[#F5F7FA]">Filters</h3>
              </div>
              <div className="space-y-6">
                {['Departure', 'Price', 'Duration', 'Operator', 'Availability'].map((label) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#F5F7FA]">{label}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-[#8B98A8]" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {label === 'Departure' ? ['Before 8am', '8am - 12pm', 'After 12pm'].map(t => (
                        <button key={t} className="rounded-full bg-white/[0.05] border border-white/[0.07] px-3 py-1 text-xs text-[#8B98A8] hover:text-[#F5F7FA] hover:border-white/[0.14] transition-colors">{t}</button>
                      )) : label === 'Price' ? ['Under ₹500', '₹500 - ₹700', 'Above ₹700'].map(t => (
                        <button key={t} className="rounded-full bg-white/[0.05] border border-white/[0.07] px-3 py-1 text-xs text-[#8B98A8] hover:text-[#F5F7FA] hover:border-white/[0.14] transition-colors">{t}</button>
                      )) : (
                        <button className="rounded-full bg-white/[0.05] border border-white/[0.07] px-3 py-1 text-xs text-[#8B98A8] hover:text-[#F5F7FA] hover:border-white/[0.14] transition-colors">All</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-[#F5F7FA]">Available Tickets</h2>
              <button className="flex items-center gap-2 text-sm text-[#8B98A8] hover:text-[#F5F7FA] transition-colors"><ArrowUpDown className="h-4 w-4" /> Sort</button>
            </div>

            <div className="space-y-5">
              {results.map((ticket) => (
                <motion.article
                  key={ticket.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`group rounded-[28px] border transition-all duration-300 overflow-hidden ${selectedTicket === ticket.id ? 'bg-[#091A2B] border-[#3B82F6]/50 shadow-[0_12px_40px_rgba(59,130,246,0.12)]' : 'bg-[#091A2B] border-white/[0.07] hover:border-white/[0.14] hover:-translate-y-0.5'}`}
                >
                  <div className="p-7 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-semibold tracking-wider uppercase text-[#8B98A8]">{ticket.operator}</span>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${ticket.direct ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{ticket.direct ? 'Direct' : '1 Stop'}</span>
                        </div>
                        <div className="flex items-center gap-6 mb-2">
                          <div>
                            <div className="font-display text-3xl font-bold text-[#F5F7FA] leading-none">{ticket.dep}</div>
                            <div className="text-sm text-[#8B98A8] mt-1">{ticket.from}</div>
                          </div>
                          <div className="flex flex-col items-center px-4">
                            <div className="text-xs text-[#8B98A8] font-medium">{ticket.duration}</div>
                            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent my-2" />
                            <ArrowRight className="h-4 w-4 text-[#8B98A8] rotate-90 lg:rotate-0" />
                          </div>
                          <div>
                            <div className="font-display text-3xl font-bold text-[#F5F7FA] leading-none">{ticket.arr}</div>
                            <div className="text-sm text-[#8B98A8] mt-1">{ticket.to}</div>
                          </div>
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex lg:flex-col lg:items-end gap-6 lg:gap-4 lg:min-w-[220px]">
                        <div className="text-right">
                          <div className="font-display text-3xl font-bold text-[#F5F7FA]">₹{ticket.price}</div>
                          <div className="text-sm text-[#8B98A8]">{ticket.seats} seats left</div>
                        </div>
                        <a href={`/trip/${ticket.id}`} onClick={() => setSelectedTicket(ticket.id)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-7 py-3 shadow-[0_8px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5 text-base whitespace-nowrap">
                          Select <ArrowRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import { useState } from 'react'
import { ArrowLeftRight, Search, CalendarDays, Users, MapPin } from 'lucide-react'
import { TRANSPORT_MODES } from '@/data/modes'
import type { TransportMode } from '@/types/transport'
import { cn } from '@/lib/utils'

export function SearchHero() {
  const [mode, setMode] = useState<TransportMode>('bus')
  const [origin, setOrigin] = useState('Vellore')
  const [destination, setDestination] = useState('Chennai')
  const [date, setDate] = useState('2026-10-12')
  const [passengers, setPassengers] = useState('1')

  const swap = () => { setOrigin(destination); setDestination(origin) }

  return (
    <section className="relative overflow-hidden bg-[#030B16]">
      <div className="absolute inset-0 bg-gradient-radial from-[#3B82F6]/[0.08] via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="max-w-[1100px]">
          <h1 className="font-display text-[48px] sm:text-[64px] lg:text-[76px] font-bold tracking-[-0.035em] text-[#F5F7FA] leading-[0.95]">
            Search & Book<br />
            <span className="text-[#8B98A8]">Your Next Journey</span>
          </h1>
          <p className="mt-5 text-[#8B98A8] text-xl lg:text-2xl max-w-xl leading-relaxed font-light">Real-time availability across buses, trains, and flights.</p>
        </div>

        <div className="mt-12 lg:mt-16 rounded-[28px] bg-[#091A2B] border border-white/[0.07] p-6 sm:p-8 lg:p-10 shadow-[0_20px_80px_rgba(2,9,20,0.5)]">
          {/* Mode pills */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1" role="tablist" aria-label="Transport mode">
            {TRANSPORT_MODES.map((m) => {
              const active = m.id === mode
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 border',
                    active
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_2px_12px_rgba(59,130,246,0.35)]'
                      : 'bg-white/[0.03] text-[#8B98A8] border-white/[0.07] hover:text-[#F5F7FA] hover:border-white/[0.14] hover:bg-white/[0.06]',
                  )}
                >
                  <m.icon className="h-4 w-4" strokeWidth={2} />
                  {m.shortLabel}
                </button>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-3 items-end">
            {/* From */}
            <div className="lg:col-span-3">
              <label htmlFor="origin" className="block text-xs font-medium text-[#8B98A8] mb-2 tracking-wide uppercase">From</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B98A8]" strokeWidth={1.5} />
                <input
                  id="origin"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full rounded-2xl bg-[#030B16] border border-white/[0.10] px-10 py-4 text-[#F5F7FA] text-lg font-medium focus:outline-none focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#5A6B7E]"
                  placeholder="Origin"
                />
              </div>
            </div>

            {/* Swap */}
            <div className="lg:col-span-1 flex lg:justify-center">
              <button
                onClick={swap}
                aria-label="Swap origin and destination"
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.10] text-[#8B98A8] hover:text-[#F5F7FA] hover:bg-white/[0.08] hover:border-white/[0.14] transition-all active:scale-95"
              >
                <ArrowLeftRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* To */}
            <div className="lg:col-span-3">
              <label htmlFor="destination" className="block text-xs font-medium text-[#8B98A8] mb-2 tracking-wide uppercase">To</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B98A8]" strokeWidth={1.5} />
                <input
                  id="destination"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="w-full rounded-2xl bg-[#030B16] border border-white/[0.10] px-10 py-4 text-[#F5F7FA] text-lg font-medium focus:outline-none focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/10 transition-all placeholder:text-[#5A6B7E]"
                  placeholder="Destination"
                />
              </div>
            </div>

            {/* Date */}
            <div className="lg:col-span-2">
              <label htmlFor="date" className="block text-xs font-medium text-[#8B98A8] mb-2 tracking-wide uppercase">Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B98A8]" strokeWidth={1.5} />
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full rounded-2xl bg-[#030B16] border border-white/[0.10] px-10 py-4 text-[#F5F7FA] text-lg font-medium focus:outline-none focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/10 transition-all"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="lg:col-span-2">
              <label htmlFor="passengers" className="block text-xs font-medium text-[#8B98A8] mb-2 tracking-wide uppercase">Passengers</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B98A8]" strokeWidth={1.5} />
                <select
                  id="passengers"
                  value={passengers}
                  onChange={e => setPassengers(e.target.value)}
                  className="w-full rounded-2xl bg-[#030B16] border border-white/[0.10] px-10 py-4 text-[#F5F7FA] text-lg font-medium focus:outline-none focus:border-[#3B82F6]/60 appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={String(n)}>{n} Travellers</option>)}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="lg:col-span-1">
              <a href={`/search?mode=${mode}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&adults=${passengers}`} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] px-6 py-4 text-white font-semibold text-lg shadow-[0_8px_30px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.45)] hover:-translate-y-0.5 transition-all">
                <Search className="h-5 w-5" strokeWidth={2} /> Search
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

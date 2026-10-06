import { ArrowRight, Clock, MapPin, Check, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useSearchParams } from 'react-router-dom'

export function FeaturedJourney() {
  const [searchParams] = useSearchParams()
  const origin = searchParams.get('origin') || 'Vellore'
  const dest = searchParams.get('destination') || 'Chennai'

  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 pb-24 lg:pb-32">
      <div className="relative rounded-[32px] overflow-hidden bg-[#091A2B] border border-white/[0.07]">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-[#3B82F6]/[0.06] to-transparent pointer-events-none" />
        <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 p-10 lg:p-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] border border-white/[0.07] px-3 py-1.5 text-sm font-medium text-[#8B98A8] mb-6">
              <Star className="h-3.5 w-3.5 text-[#F59E0B]" fill="currentColor" /> Featured Journey
            </div>
            <h2 className="font-display text-[36px] sm:text-[44px] lg:text-[52px] font-bold tracking-[-0.03em] text-[#F5F7FA] leading-[1.05]">
              {origin} <span className="text-[#8B98A8]">→</span> {dest}
            </h2>
            <p className="mt-4 text-[#8B98A8] text-lg leading-relaxed max-w-md">Direct service with premium seating, onboard amenities, and real-time tracking. Book early for the best prices.</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-2xl bg-[#030B16] border border-white/[0.07] px-4 py-2.5 text-sm text-[#F5F7FA] font-medium">
                <Clock className="h-4 w-4 text-[#3B82F6]" /> 3h 20m
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-[#030B16] border border-white/[0.07] px-4 py-2.5 text-sm text-[#F5F7FA] font-medium">
                <MapPin className="h-4 w-4 text-[#3B82F6]" /> Direct
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-[#030B16] border border-white/[0.07] px-4 py-2.5 text-sm text-[#F5F7FA] font-medium">
                <Check className="h-4 w-4 text-[#10B981]" /> 24 seats left
              </div>
            </div>

            <a href={`/search?mode=bus&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&date=${new Date().toISOString().slice(0,10)}&adults=1`} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold px-7 py-3.5 shadow-[0_8px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] transition-all hover:-translate-y-0.5 text-base">
              Book this journey <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-[#030B16] border border-white/[0.07] p-8">
              <div className="text-sm text-[#8B98A8] mb-2">From</div>
              <div className="font-display text-4xl font-bold text-[#F5F7FA]">₹450</div>
              <div className="mt-4 space-y-3 text-[#8B98A8]">
                <div className="flex justify-between text-sm"><span>Departure</span><span className="text-[#F5F7FA] font-medium">08:30</span></div>
                <div className="flex justify-between text-sm"><span>Arrival</span><span className="text-[#F5F7FA] font-medium">11:50</span></div>
                <div className="h-px bg-white/[0.07]" />
                <div className="flex justify-between text-sm"><span>Duration</span><span className="text-[#F5F7FA] font-medium">3h 20m</span></div>
                <div className="flex justify-between text-sm"><span>Type</span><span className="text-[#F5F7FA] font-medium">Direct · AC Seater</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

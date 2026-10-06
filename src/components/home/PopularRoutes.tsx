import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { motion } from 'motion/react'

const routes = [
  { from: 'Vellore', to: 'Chennai', price: '₹450', time: '3h 20m', direct: true },
  { from: 'Chennai', to: 'Bangalore', price: '₹650', time: '7h 10m', direct: true },
  { from: 'Vellore', to: 'Bangalore', price: '₹700', time: '8h 45m', direct: false },
  { from: 'Coimbatore', to: 'Chennai', price: '₹380', time: '2h 50m', direct: true },
]

export function PopularRoutes() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-24 lg:py-32">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-14">
        <div>
          <h2 className="font-display text-[40px] sm:text-[48px] lg:text-[56px] font-bold tracking-[-0.03em] text-[#F5F7FA] leading-[1.05]">
            Popular Routes
          </h2>
          <p className="mt-3 text-[#8B98A8] text-lg">Explore journeys with high availability and great value.</p>
        </div>
        <a href="/search" className="inline-flex items-center gap-2 text-[#3B82F6] font-medium hover:text-[#2563EB] transition-colors text-base">
          View all routes <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {routes.map((r, i) => (
          <motion.a
            href="/search"
            key={r.from + r.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group relative rounded-3xl bg-[#091A2B] border border-white/[0.07] p-7 hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(59,130,246,0.08)] overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3B82F6]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05] text-[#8B98A8] group-hover:text-[#F5F7FA] group-hover:bg-white/[0.08] transition-colors">
                <MapPin className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-[#8B98A8]">
                <span className="text-[#F5F7FA]">{r.from}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-[#F5F7FA]">{r.to}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display text-3xl font-bold text-[#F5F7FA] tracking-tight">{r.price}</span>
              <span className="text-[#5A6B7E] text-sm">from</span>
            </div>

            <div className="flex items-center gap-4 text-[#8B98A8] text-sm">
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {r.time}</span>
              <span className="w-1 h-1 rounded-full bg-[#5A6B7E]" />
              <span>{r.direct ? 'Direct' : '1 Stop'}</span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

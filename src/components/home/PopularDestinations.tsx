import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Badge } from '@/components/ui/Badge'
import { POPULAR_DESTINATIONS } from '@/data/discovery'

const GRADIENTS: Record<string, string> = {
  bengaluru: 'from-signal-700 to-signal-900',
  goa: 'from-amber-500 to-coral-600',
  delhi: 'from-ink-700 to-ink-900',
  mumbai: 'from-coral-500 to-ink-900',
  jaipur: 'from-amber-400 to-amber-600',
  kochi: 'from-signal-500 to-ink-800',
}

export function PopularDestinations() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-600">Discover</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
              Popular destinations
            </h2>
          </div>
          <button className="hidden shrink-0 items-center gap-1 text-sm font-medium text-ink-700 hover:text-signal-600 sm:flex">
            View all destinations
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          {POPULAR_DESTINATIONS.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl p-3.5 text-left shadow-sm"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${GRADIENTS[d.image] ?? 'from-ink-700 to-ink-900'} transition-transform duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              {d.tag && (
                <Badge variant="outline-light" className="absolute left-3 top-3">
                  {d.tag}
                </Badge>
              )}
              <div className="relative">
                <p className="font-display text-base font-semibold text-white">{d.city}</p>
                <p className="text-xs text-white/70">From ₹{d.fromPrice.toLocaleString('en-IN')}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </Container>
    </section>
  )
}

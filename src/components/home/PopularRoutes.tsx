import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { ModeIcon } from '@/components/transport/ModeIcon'
import { POPULAR_ROUTES } from '@/data/discovery'

export function PopularRoutes() {
  return (
    <section className="bg-paper-dim py-16 sm:py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-600">Frequently booked</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
          Popular routes, every mode
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_ROUTES.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
            >
              <Card className="group flex cursor-pointer flex-col gap-4 p-4 transition-shadow hover:shadow-[0_8px_24px_rgba(10,15,28,0.08)] sm:p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-50 text-signal-600">
                    <ModeIcon mode={r.mode} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-xs font-medium text-ink-400">{r.frequency}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink-900">{r.origin}</span>
                  <span className="route-dotted h-px flex-1" />
                  <ArrowRight className="h-3.5 w-3.5 text-ink-400 transition-transform group-hover:translate-x-0.5" />
                  <span className="route-dotted h-px flex-1" />
                  <span className="text-sm font-semibold text-ink-900">{r.destination}</span>
                </div>

                <div className="flex items-center justify-between border-t border-paper-line pt-3">
                  <span className="text-xs text-ink-400">{r.duration}</span>
                  <span className="text-sm font-semibold text-ink-950">
                    From <span className="text-signal-700">₹{r.fromPrice.toLocaleString('en-IN')}</span>
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

import { motion } from 'motion/react'
import { ShieldCheck, BadgeCheck, PhoneCall } from 'lucide-react'
import { Container } from '@/components/ui/Container'

const POINTS = [
  { icon: BadgeCheck, label: 'ID-verified drivers & operators' },
  { icon: ShieldCheck, label: 'Live trip tracking on every booking' },
  { icon: PhoneCall, label: 'One-tap emergency support' },
]

export function SafetySection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="overflow-hidden rounded-2xl bg-ink-950 px-6 py-12 sm:px-12 sm:py-16">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-400">Safety, built in</p>
              <h2 className="mt-2 max-w-md font-display text-2xl font-semibold text-white sm:text-3xl">
                Every trip on NEXTRIP is tracked, verified and covered
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">
                From the moment you book to the moment you arrive, we keep an eye on the journey so you don't have to.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-3">
              {POINTS.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <p.icon className="h-5 w-5 text-signal-400" strokeWidth={1.75} />
                  <p className="mt-3 text-sm font-medium leading-snug text-white/90">{p.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

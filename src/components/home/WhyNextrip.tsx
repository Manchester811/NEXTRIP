import { motion } from 'motion/react'
import { Layers, ShieldCheck, Wallet, Headset } from 'lucide-react'
import { Container } from '@/components/ui/Container'

const FEATURES = [
  {
    icon: Layers,
    title: 'One search, six modes',
    body: 'Compare buses, trains, flights, cabs, metro and ferries side by side — no switching apps.',
  },
  {
    icon: Wallet,
    title: 'Transparent pricing',
    body: 'The fare you see is the fare you pay. No surprise fees at checkout.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified operators',
    body: 'Every partner is vetted for safety, punctuality and service quality.',
  },
  {
    icon: Headset,
    title: '24/7 trip support',
    body: 'Real humans on call if your plans change, day or night.',
  },
]

export function WhyNextrip() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-600">Why NEXTRIP</p>
        <h2 className="mt-2 max-w-xl font-display text-2xl font-semibold text-ink-950 sm:text-3xl">
          Built for people who'd rather be moving than comparing tabs
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink-950 text-signal-400">
                <f.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-950">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

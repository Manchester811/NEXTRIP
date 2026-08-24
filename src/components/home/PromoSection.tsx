import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export function PromoSection() {
  return (
    <section className="pb-16 sm:pb-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-signal-600 to-signal-900 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-12"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-100">Limited time</p>
            <h2 className="mt-2 max-w-md font-display text-2xl font-semibold text-white sm:text-3xl">
              Get ₹150 off your first NEXTRIP booking
            </h2>
            <p className="mt-2 text-sm text-signal-50/80">Use code NEXT150 at checkout, on any mode of transport.</p>
          </div>
          <Button variant="primary" size="lg" className="shrink-0">
            Claim offer
          </Button>
        </motion.div>
      </Container>
    </section>
  )
}

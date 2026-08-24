import { motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { SearchWidget } from '@/components/search/SearchWidget'
import { DepartureBoard } from './DepartureBoard'

export function Hero() {
  return (
    <section className="relative overflow-visible bg-ink-950 pb-32 pt-16 sm:pt-20">
      {/* Ambient route-line backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.12]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #14a898 0%, transparent 40%), radial-gradient(circle at 85% 0%, #f2a325 0%, transparent 35%)',
        }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal-400" />
              6 modes of transport, one search
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
              className="mt-5 text-balance font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[3.4rem]"
            >
              Every journey.
              <br />
              <span className="text-signal-400">One platform.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
              className="mt-5 max-w-md text-balance text-[15px] leading-relaxed text-white/60 sm:text-base"
            >
              Compare and book buses, trains, flights, cabs, metro and ferries — from one seamless travel platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.18 }}
              className="mt-8 hidden lg:block"
            >
              <DepartureBoard />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
            className="hidden lg:block"
          >
            <HeroGraphic />
          </motion.div>
        </div>
      </Container>

      <div className="relative mt-10 lg:mt-0 lg:absolute lg:-bottom-16 lg:left-0 lg:right-0">
        <Container>
          <SearchWidget />
        </Container>
      </div>
    </section>
  )
}

function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <svg viewBox="0 0 320 320" className="h-full w-full" aria-hidden="true">
        <circle cx="160" cy="160" r="150" fill="none" stroke="#1c2740" strokeWidth="1.5" />
        <circle cx="160" cy="160" r="112" fill="none" stroke="#1c2740" strokeWidth="1.5" strokeDasharray="2 8" />
        <path
          d="M 60 220 C 100 120, 220 200, 260 90"
          fill="none"
          stroke="#14a898"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 10"
        />
        <circle cx="60" cy="220" r="6" fill="#f2a325" />
        <circle cx="260" cy="90" r="6" fill="#14a898" />
        <circle cx="160" cy="160" r="4" fill="#fb6b4c" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-center backdrop-blur-sm">
          <p className="font-display text-3xl font-semibold text-white">6</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-white/50">Transport modes</p>
        </div>
      </div>
    </div>
  )
}

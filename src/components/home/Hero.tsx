import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { SearchHero } from '@/components/search/SearchHero'

export function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#030B16]">
      {/* Subtle radial glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-radial from-[#3B82F6]/[0.07] via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-5xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[56px] sm:text-[72px] lg:text-[88px] font-bold tracking-[-0.035em] text-[#F5F7FA] leading-[0.95] text-balance"
          >
            Search & Book<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">Your Next Journey</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 text-[#8B98A8] text-xl lg:text-2xl max-w-2xl leading-relaxed font-light"
          >
            Find the right ticket for your next journey. Premium infrastructure, real-time availability, seamless booking.
          </motion.p>
        </div>
      </div>
    </section>
    <SearchHero />
    </>
  )
}

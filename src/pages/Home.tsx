import { Hero } from '@/components/home/Hero'
import { PopularDestinations } from '@/components/home/PopularDestinations'
import { PopularRoutes } from '@/components/home/PopularRoutes'
import { WhyNextrip } from '@/components/home/WhyNextrip'
import { SafetySection } from '@/components/home/SafetySection'
import { PromoSection } from '@/components/home/PromoSection'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="pt-16 lg:pt-24">
        <PopularDestinations />
        <PopularRoutes />
        <WhyNextrip />
        <SafetySection />
        <PromoSection />
      </div>
    </>
  )
}

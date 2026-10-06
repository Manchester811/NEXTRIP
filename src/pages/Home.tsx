import { Hero } from '@/components/home/Hero'
import { PopularRoutes } from '@/components/home/PopularRoutes'
import { FeaturedJourney } from '@/components/home/FeaturedJourney'

export default function Home() {
  return (
    <>
      <Hero />
      <PopularRoutes />
      <FeaturedJourney />
    </>
  )
}

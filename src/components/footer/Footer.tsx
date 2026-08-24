import { Link } from 'react-router-dom'
import { Bus, TrainFront, Plane, Car, TramFront, Ship } from 'lucide-react'
import { Container } from '@/components/ui/Container'

const COLUMNS = [
  {
    title: 'Travel',
    links: [
      { label: 'Flights', to: '/search?mode=flight', icon: Plane },
      { label: 'Trains', to: '/search?mode=train', icon: TrainFront },
      { label: 'Buses', to: '/search?mode=bus', icon: Bus },
      { label: 'Cabs', to: '/search?mode=cab', icon: Car },
      { label: 'Metro', to: '/search?mode=metro', icon: TramFront },
      { label: 'Ferries', to: '/search?mode=ferry', icon: Ship },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About NEXTRIP', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
      { label: 'Partner with us', to: '/partners' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help centre', to: '/help' },
      { label: 'My bookings', to: '/bookings' },
      { label: 'Cancellation policy', to: '/help/cancellations' },
      { label: 'Contact us', to: '/help/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', to: '/legal/terms' },
      { label: 'Privacy policy', to: '/legal/privacy' },
      { label: 'Refund policy', to: '/legal/refunds' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-ink-950 pt-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 pb-12 sm:grid-cols-4 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-500 text-ink-950 font-display font-bold text-sm">
                N
              </span>
              <span className="font-display text-lg font-semibold text-white">NEXTRIP</span>
            </Link>
            <p className="mt-3 max-w-[240px] text-sm leading-relaxed text-white/45">
              Every journey. One platform. Compare and book across six modes of transport in seconds.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/40">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="flex items-center gap-2 text-sm text-white/65 hover:text-white">
                      {'icon' in link && link.icon ? <link.icon className="h-3.5 w-3.5 text-white/35" /> : null}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-white/35">© {new Date().getFullYear()} NEXTRIP. All rights reserved.</p>
          <p className="text-xs text-white/35">Made for travellers, by travellers.</p>
        </div>
      </Container>
    </footer>
  )
}

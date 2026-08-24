import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Flights', to: '/search?mode=flight' },
  { label: 'Trains', to: '/search?mode=train' },
  { label: 'Buses', to: '/search?mode=bus' },
  { label: 'Metro', to: '/search?mode=metro' },
  { label: 'Cabs', to: '/search?mode=cab' },
  { label: 'Ferries', to: '/search?mode=ferry' },
  { label: 'My Bookings', to: '/bookings' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const darkPage = location.pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-300',
        darkPage && !scrolled ? 'bg-transparent' : 'bg-ink-950/95 backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.06)]',
      )}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 sm:px-6 lg:px-8 py-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="NEXTRIP home">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-500 text-ink-950 font-display font-bold text-sm">
            N
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            NEXTRIP
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white hover:bg-white/5',
                  isActive && 'text-white bg-white/10',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button variant="ghost-light" size="sm" asChild>
            <Link to="/help">Help</Link>
          </Button>
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10" asChild>
            <Link to="/login">
              <UserRound className="h-4 w-4" strokeWidth={1.75} />
              Login
            </Link>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-ink-950 border-t border-white/10"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-white/85 hover:bg-white/5"
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-2 flex gap-2 pt-2 border-t border-white/10">
                <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" asChild>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
                </Button>
                <Button variant="primary" className="flex-1" asChild>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Sign up</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

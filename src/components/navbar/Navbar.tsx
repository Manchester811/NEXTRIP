import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, UserRound, Ticket, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Search', to: '/search', icon: Search },
  { label: 'My Bookings', to: '/bookings', icon: Ticket },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isLoading } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isHome && !scrolled
          ? 'bg-transparent'
          : 'bg-[#030B16]/80 backdrop-blur-xl border-b border-white/[0.07]',
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-12 py-4 lg:py-5">
        <Link to="/" className="flex items-center gap-3 shrink-0 group" aria-label="NEXTRIP home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white font-display font-bold text-lg shadow-[0_4px_20px_rgba(59,130,246,0.35)] group-hover:shadow-[0_6px_28px_rgba(59,130,246,0.45)] transition-shadow">
            N
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-[#F5F7FA] leading-none">
            NEXTRIP
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) => cn(
                'relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-medium transition-all duration-200',
                isActive
                  ? 'text-[#F5F7FA] bg-white/[0.08]'
                  : 'text-[#8B98A8] hover:text-[#F5F7FA] hover:bg-white/[0.05]',
              )}
            >
              <link.icon className="h-4 w-4" strokeWidth={1.5} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <NavLink
            to="/help"
            className="rounded-xl px-4 py-2.5 text-[15px] font-medium text-[#8B98A8] hover:text-[#F5F7FA] hover:bg-white/[0.05] transition-colors"
          >
            Help
          </NavLink>
          {isLoading ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-white/5" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-medium text-[#8B98A8] hover:text-[#F5F7FA] hover:bg-white/[0.05] transition-colors"
              >
                <UserRound className="h-4 w-4" strokeWidth={1.5} />
                Profile
              </Link>
              <Link
                to="/bookings"
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-medium text-[#F5F7FA] bg-white/[0.08] hover:bg-white/[0.12] transition-colors border border-white/[0.07]"
              >
                <Ticket className="h-4 w-4" strokeWidth={1.5} />
                Bookings
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-xl px-4 py-2.5 text-[15px] font-medium text-[#8B98A8] hover:text-[#F5F7FA] hover:bg-white/[0.05] transition-colors">Sign in</Link>
              <Link to="/register" className="rounded-xl px-4 py-2.5 text-[15px] font-medium text-[#020914] bg-[#F5F7FA] hover:bg-white transition-colors shadow-[0_2px_12px_rgba(255,255,255,0.08)]">Get Started</Link>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(v => !v)}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl text-[#F5F7FA] hover:bg-white/[0.05] transition-colors"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-[#030B16]/95 backdrop-blur-2xl border-t border-white/[0.07]"
          >
            <div className="mx-auto max-w-[1440px] px-6 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[#F5F7FA] text-lg font-medium hover:bg-white/[0.05] transition-colors">
                  <link.icon className="h-5 w-5 text-[#8B98A8]" strokeWidth={1.5} />
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/[0.07] my-2" />
              <Link to="/help" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3 text-[#8B98A8] text-lg font-medium hover:text-[#F5F7FA] hover:bg-white/[0.05]">Help</Link>
              {user && (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3 text-[#8B98A8] text-lg font-medium hover:text-[#F5F7FA] hover:bg-white/[0.05]">Profile</Link>
                  <Link to="/bookings" onClick={() => setMobileOpen(false)} className="rounded-2xl px-4 py-3 text-[#F5F7FA] text-lg font-medium bg-white/[0.08]">My Bookings</Link>
                </>
              )}
              {!user && (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-2xl px-4 py-3 text-[#8B98A8] text-lg font-medium border border-white/[0.10]">Sign in</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center rounded-2xl px-4 py-3 text-[#020914] text-lg font-medium bg-[#F5F7FA]">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

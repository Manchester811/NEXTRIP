import { CalendarDays } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/[0.07] bg-[#020914]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-12 py-14 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5">
            <a href="/" className="flex items-center gap-3" aria-label="NEXTRIP home">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white font-display font-bold text-lg shadow-[0_4px_20px_rgba(59,130,246,0.35)]">N</span>
              <span className="font-display text-2xl font-bold tracking-tight text-[#F5F7FA]">NEXTRIP</span>
            </a>
            <p className="mt-4 text-[#8B98A8] leading-relaxed max-w-md">Premium multi-modal ticket booking. Real-time availability, seamless checkout, and reliable journeys.</p>
          </div>
          <div className="lg:col-span-3 lg:pl-8">
            <h3 className="text-sm font-semibold text-[#F5F7FA] tracking-wide uppercase mb-4">Platform</h3>
            <ul className="space-y-2.5 text-[#8B98A8] text-[15px]">
              {['Search tickets','My bookings','Profile','Help center'].map(l => <li key={l}><a href={l === 'Search tickets' ? '/search' : l === 'My bookings' ? '/bookings' : l === 'Profile' ? '/profile' : '/help'} className="hover:text-[#F5F7FA] transition-colors">{l}</a></li>)}
            </ul>
          </div>
          <div className="lg:col-span-4 lg:pl-8">
            <h3 className="text-sm font-semibold text-[#F5F7FA] tracking-wide uppercase mb-4">Company</h3>
            <ul className="space-y-2.5 text-[#8B98A8] text-[15px]">
              {['About us','Careers','Press','Contact'].map(l => <li key={l}><a href="/about" className="hover:text-[#F5F7FA] transition-colors">{l}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#5A6B7E] text-sm">
          <span>© {year} NEXTRIP. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#F5F7FA] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#F5F7FA] transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { motion } from 'motion/react'
import { DEPARTURE_BOARD_ROWS } from '@/data/discovery'
import { ModeIcon } from '@/components/transport/ModeIcon'

export function DepartureBoard() {
  return (
    <div className="w-full max-w-md rounded-xl border border-white/10 bg-ink-900/60 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/45">
          Live departures
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-signal-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-400" />
          NEXTRIP
        </span>
      </div>

      <div className="flex flex-col">
        {DEPARTURE_BOARD_ROWS.map((row, i) => (
          <motion.div
            key={row.code}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
            className="flex items-center gap-3 border-b border-white/[0.06] py-2 last:border-0"
          >
            <ModeIcon mode={row.mode} className="h-3.5 w-3.5 text-white/40" />
            <span className="flap w-14 text-xs text-white/70">{row.code}</span>
            <span className="flap flex-1 truncate text-xs text-white/85">{row.route}</span>
            <span className="flap w-12 text-right text-xs text-amber-400">{row.time}</span>
            <span
              className={
                'flap w-[72px] shrink-0 truncate text-right text-[11px] ' +
                (row.status === 'Boarding' ? 'text-coral-400' : 'text-signal-400')
              }
            >
              {row.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

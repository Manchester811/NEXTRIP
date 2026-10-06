import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Calendar, Pencil, Users } from 'lucide-react'
import type { SearchParams } from '@/types/transport'
import { ModeIcon } from '@/components/transport/ModeIcon'
import { SearchWidget } from './SearchWidget'
import { Button } from '@/components/ui/Button'

interface ResultsSearchBarProps {
  params: SearchParams
}

export function ResultsSearchBar({ params }: ResultsSearchBarProps) {
  const [editing, setEditing] = useState(false)
  const totalPassengers = params.passengers.adults + params.passengers.children + params.passengers.infants
  const dateLabel = params.departDate
    ? new Date(`${params.departDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })
    : 'Any date'

  return (
    <div className="border-b border-white/5 bg-[var(--color-bg-base)]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-muted)]">
            <ModeIcon mode={params.mode} className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <p className="truncate text-sm font-medium text-[var(--color-text-primary)] sm:text-base">
              {params.origin || 'Anywhere'}
            </p>
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
            <p className="truncate text-sm font-medium text-[var(--color-text-primary)] sm:text-base">
              {params.destination || 'Anywhere'}
            </p>
          </div>

          <div className="hidden items-center gap-1.5 text-sm text-[var(--color-text-muted)] sm:flex">
            <Calendar className="h-4 w-4" />
            {dateLabel}
          </div>

          <div className="hidden items-center gap-1.5 text-sm text-[var(--color-text-muted)] md:flex">
            <Users className="h-4 w-4" />
            {totalPassengers} {totalPassengers === 1 ? 'traveller' : 'travellers'}
          </div>

          <Button variant="outline" size="sm" onClick={() => setEditing((v) => !v)} className="ml-auto shrink-0 sm:ml-0">
            <Pencil className="h-3.5 w-3.5" />
            Modify search
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden pb-6"
            >
              <SearchWidget floating={false} initial={params} onSearch={() => setEditing(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
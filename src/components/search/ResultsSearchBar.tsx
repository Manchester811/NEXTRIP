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
    <div className="border-b border-paper-line bg-white">
      <div className="mx-auto max-w-[1240px] px-5 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-signal-50 text-signal-600">
            <ModeIcon mode={params.mode} className="h-[18px] w-[18px]" />
          </span>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <p className="truncate text-sm font-semibold text-ink-950 sm:text-base">
              {params.origin || 'Anywhere'}
            </p>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-400" />
            <p className="truncate text-sm font-semibold text-ink-950 sm:text-base">
              {params.destination || 'Anywhere'}
            </p>
          </div>

          <div className="hidden items-center gap-1.5 text-sm text-ink-500 sm:flex">
            <Calendar className="h-4 w-4 text-ink-400" />
            {dateLabel}
          </div>

          <div className="hidden items-center gap-1.5 text-sm text-ink-500 md:flex">
            <Users className="h-4 w-4 text-ink-400" />
            {totalPassengers} {totalPassengers === 1 ? 'passenger' : 'passengers'}
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
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <SearchWidget floating={false} initial={params} onSearch={() => setEditing(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

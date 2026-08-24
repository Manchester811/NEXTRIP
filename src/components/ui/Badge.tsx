import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'signal' | 'amber' | 'coral' | 'neutral' | 'outline-light'
  className?: string
}

const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
  signal: 'bg-signal-50 text-signal-700 border border-signal-100',
  amber: 'bg-amber-100 text-amber-600 border border-amber-300/60',
  coral: 'bg-coral-400/10 text-coral-600 border border-coral-400/30',
  neutral: 'bg-ink-900/5 text-ink-700 border border-ink-900/10',
  'outline-light': 'bg-white/10 text-white border border-white/20',
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

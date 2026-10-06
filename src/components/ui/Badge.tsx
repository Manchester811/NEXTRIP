import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'outline'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-white/10 text-[var(--color-text-primary)] border border-white/10',
  accent: 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent)]/20',
  success: 'bg-[var(--color-success-muted)] text-[var(--color-success)] border border-[var(--color-success)]/20',
  warning: 'bg-[var(--color-warning-muted)] text-[var(--color-warning)] border border-[var(--color-warning)]/20',
  error: 'bg-[var(--color-error-muted)] text-[var(--color-error)] border border-[var(--color-error)]/20',
  outline: 'bg-transparent text-[var(--color-text-secondary)] border border-white/10',
}

const sizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2.5 py-0.5 text-[11px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
}

export function Badge({ children, variant = 'default', className, size = 'md' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill font-medium tracking-wide',
        styles[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
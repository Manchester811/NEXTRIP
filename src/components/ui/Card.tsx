import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-[var(--color-bg-card)] transition-all duration-300 hover:border-white/15',
        className,
      )}
      {...props}
    />
  )
}
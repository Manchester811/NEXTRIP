import { cn } from '@/lib/utils'

interface FieldShellProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  className?: string
}

export function FieldShell({ icon, label, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-white/10 bg-[var(--color-bg-secondary)] p-4 transition-all duration-200 hover:border-white/15', className)}>
      <span className="text-[var(--color-text-muted)] shrink-0 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="block text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">{label}</span>
        {children}
      </div>
    </div>
  )
}
import { cn } from '@/lib/utils'

interface FieldShellProps {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  className?: string
}

export function FieldShell({ icon, label, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex items-center gap-2.5 rounded-lg px-3.5 py-3 transition-colors hover:bg-ink-900/[0.03]', className)}>
      <span className="text-ink-400 shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-400">{label}</span>
        {children}
      </div>
    </div>
  )
}

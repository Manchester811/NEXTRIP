import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
  className?: string
  label?: string
}

export function Checkbox({ checked, onCheckedChange, id, className, label }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
      <CheckboxPrimitive.Root
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/15 bg-[var(--color-bg-secondary)]',
          'data-[state=checked]:border-[var(--color-accent)] data-[state=checked]:bg-[var(--color-accent)]',
          'hover:border-[var(--color-accent)]/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]',
          'disabled:opacity-50 disabled:pointer-events-none',
          className,
        )}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && <span className="text-sm text-[var(--color-text-secondary)]">{label}</span>}
    </label>
  )
}
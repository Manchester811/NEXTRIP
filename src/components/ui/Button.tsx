import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]',
  {
    variants: {
      variant: {
        primary: 'bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] active:bg-[var(--color-accent)]/90 shadow-[0_4px_20px_rgba(59,130,246,.3)] hover:shadow-[0_8px_30px_rgba(59,130,246,.4)]',
        secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] border border-white/10 hover:bg-[var(--color-bg-elevated)] hover:border-white/15',
        outline: 'bg-transparent text-[var(--color-text-primary)] border border-white/10 hover:bg-white/5 hover:border-white/20',
        ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)]',
        destructive: 'bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 shadow-[0_4px_20px_rgba(239,68,68,.3)]',
        success: 'bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
        xl: 'h-16 px-10 text-lg',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
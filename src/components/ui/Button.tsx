import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-amber-500 text-ink-950 hover:bg-amber-400 active:bg-amber-600',
        signal: 'bg-signal-600 text-white hover:bg-signal-500 active:bg-signal-700',
        dark: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950',
        outline: 'border border-ink-600/30 bg-transparent text-ink-900 hover:bg-ink-900/5',
        ghost: 'bg-transparent text-ink-900 hover:bg-ink-900/5',
        'ghost-light': 'bg-transparent text-white hover:bg-white/10',
        link: 'bg-transparent p-0 h-auto rounded-none text-signal-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-[52px] px-7 text-base',
        icon: 'h-10 w-10',
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

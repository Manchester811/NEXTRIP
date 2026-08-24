import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-xl border border-paper-line bg-white shadow-[0_1px_2px_rgba(10,15,28,0.04)]',
        className,
      )}
      {...props}
    />
  )
}

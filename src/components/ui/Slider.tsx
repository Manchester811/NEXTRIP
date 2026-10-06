import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

interface SliderProps {
  value: [number, number]
  min: number
  max: number
  step?: number
  onChange: (value: [number, number]) => void
  className?: string
}

export function Slider({ value, min, max, step = 1, onChange, className }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex h-5 w-full touch-none select-none items-center', className)}
      value={value}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
      onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
    >
      <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-white/10">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-[var(--color-accent)]" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg-base)] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]" />
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg-base)] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]" />
    </SliderPrimitive.Root>
  )
}
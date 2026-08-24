import * as SliderPrimitive from '@radix-ui/react-slider'

interface SliderProps {
  value: [number, number]
  min: number
  max: number
  step?: number
  onChange: (value: [number, number]) => void
}

export function Slider({ value, min, max, step = 1, onChange }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className="relative flex h-5 w-full touch-none select-none items-center"
      value={value}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
      onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
    >
      <SliderPrimitive.Track className="relative h-1 grow rounded-full bg-ink-900/10">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-signal-600" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-signal-600 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2" />
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-signal-600 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-500 focus-visible:ring-offset-2" />
    </SliderPrimitive.Root>
  )
}

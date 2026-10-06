import { Calendar } from 'lucide-react'
import { FieldShell } from './FieldShell'

interface DateFieldProps {
  label: string
  value: string
  min?: string
  onChange: (value: string) => void
}

export function DateField({ label, value, min, onChange }: DateFieldProps) {
  return (
    <FieldShell icon={<Calendar className="h-5 w-5" strokeWidth={2} />} label={label}>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] outline-none [color-scheme:light]"
      />
    </FieldShell>
  )
}
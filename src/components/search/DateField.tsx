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
    <FieldShell icon={<Calendar strokeWidth={1.75} />} label={label}>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[15px] font-semibold text-ink-900 outline-none [color-scheme:light]"
      />
    </FieldShell>
  )
}

import { MapPin } from 'lucide-react'
import { FieldShell } from './FieldShell'

interface LocationFieldProps {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export function LocationField({ label, value, placeholder, onChange }: LocationFieldProps) {
  return (
    <FieldShell icon={<MapPin className="h-5 w-5" strokeWidth={2} />} label={label}>
      <input
        type="text"
        value={value}
        placeholder={placeholder ?? 'City, station or airport'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm font-medium text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
      />
    </FieldShell>
  )
}
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
    <FieldShell icon={<MapPin strokeWidth={1.75} />} label={label}>
      <input
        type="text"
        value={value}
        placeholder={placeholder ?? 'City, station or airport'}
        onChange={(e) => onChange(e.target.value)}
        className="w-full truncate bg-transparent text-[15px] font-semibold text-ink-900 outline-none placeholder:font-medium placeholder:text-ink-400"
      />
    </FieldShell>
  )
}

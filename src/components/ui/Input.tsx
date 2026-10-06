import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  trailing?: React.ReactNode
}

export function Input({ label, error, icon, trailing, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className={cn('w-full', className)}>
      {label && (
        <span className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{label}</span>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10',
            'text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]',
            'px-4 py-3.5 text-sm transition-all duration-200',
            'hover:border-white/15',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]',
            'disabled:opacity-50 disabled:pointer-events-none',
            icon && 'pl-12',
            trailing && 'pr-12',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]',
            props.className,
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {trailing && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" aria-hidden="true">
            {trailing}
          </span>
        )}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}
    </label>
  )
}

export function Textarea({ label, error, className, id, ...props }: Omit<InputProps, 'icon' | 'trailing'> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className={cn('w-full', className)}>
      {label && (
        <span className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{label}</span>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10',
          'text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]',
          'px-4 py-3.5 text-sm transition-all duration-200 resize-none',
          'hover:border-white/15',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]',
          'disabled:opacity-50 disabled:pointer-events-none',
          error && 'border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]',
          props.className,
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}
    </label>
  )
}

export function Select({ label, error, className, id, options, placeholder, ...props }: Omit<InputProps, 'icon' | 'trailing'> & {
  options: { value: string; label: string }[]
  placeholder?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <label className={cn('w-full', className)}>
      {label && (
        <span className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">{label}</span>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full rounded-xl bg-[var(--color-bg-secondary)] border border-white/10',
            'text-[var(--color-text-primary)]',
            'px-4 py-3.5 pr-12 text-sm transition-all duration-200 appearance-none',
            'hover:border-white/15',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-elevated)]',
            'disabled:opacity-50 disabled:pointer-events-none',
            error && 'border-[var(--color-error)] focus:ring-[var(--color-error)] focus:border-[var(--color-error)]',
            props.className,
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>
      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}
    </label>
  )
}
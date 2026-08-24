import { Container } from '@/components/ui/Container'

interface PlaceholderProps {
  title: string
  description?: string
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink-950">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        {description ?? 'This part of NEXTRIP is coming in a later phase.'}
      </p>
    </Container>
  )
}

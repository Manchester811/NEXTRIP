import {
  Bus,
  TrainFront,
  Plane,
  Car,
  TramFront,
  Ship,
  type LucideIcon,
} from 'lucide-react'
import type { TransportMode } from '@/types/transport'
import { cn } from '@/lib/utils'

const ICONS: Record<TransportMode, LucideIcon> = {
  bus: Bus,
  train: TrainFront,
  flight: Plane,
  cab: Car,
  metro: TramFront,
  ferry: Ship,
}

interface ModeIconProps {
  mode: TransportMode
  className?: string
  strokeWidth?: number
}

export function ModeIcon({ mode, className, strokeWidth = 1.75 }: ModeIconProps) {
  const Icon = ICONS[mode]
  return <Icon className={cn('shrink-0', className)} strokeWidth={strokeWidth} aria-hidden="true" />
}

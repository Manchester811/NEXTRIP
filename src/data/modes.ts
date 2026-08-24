import type { TransportModeMeta } from '@/types/transport'

export const TRANSPORT_MODES: TransportModeMeta[] = [
  {
    id: 'bus',
    label: 'Bus',
    shortLabel: 'Bus',
    originLabel: 'From',
    destinationLabel: 'To',
    icon: 'Bus',
  },
  {
    id: 'train',
    label: 'Train',
    shortLabel: 'Train',
    originLabel: 'From',
    destinationLabel: 'To',
    icon: 'TrainFront',
  },
  {
    id: 'flight',
    label: 'Flight',
    shortLabel: 'Flight',
    originLabel: 'From',
    destinationLabel: 'To',
    icon: 'Plane',
  },
  {
    id: 'cab',
    label: 'Cab',
    shortLabel: 'Cab',
    originLabel: 'Pickup',
    destinationLabel: 'Destination',
    icon: 'Car',
  },
  {
    id: 'metro',
    label: 'Metro',
    shortLabel: 'Metro',
    originLabel: 'From station',
    destinationLabel: 'To station',
    icon: 'TramFront',
  },
  {
    id: 'ferry',
    label: 'Ferry',
    shortLabel: 'Ferry',
    originLabel: 'From port',
    destinationLabel: 'To port',
    icon: 'Ship',
  },
]

export const getModeMeta = (mode: string) =>
  TRANSPORT_MODES.find((m) => m.id === mode) ?? TRANSPORT_MODES[0]

import { useMemo, useState } from 'react'
import { CalendarDays, ChevronRight, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container } from '@/components/ui/Container'
import { ModeIcon } from '@/components/transport/ModeIcon'
import { cancelBooking, getBookings } from '@/services/bookingStore'

const tabs = ['all', 'upcoming', 'completed', 'cancelled'] as const
type BookingTab = (typeof tabs)[number]

export default function Bookings() {
  const [bookings, setBookings] = useState(getBookings())
  const [tab, setTab] = useState<BookingTab>('all')

  const visible = useMemo(() => {
    if (tab === 'all') return bookings
    return bookings.filter((booking) => booking.status.toLowerCase() === tab)
  }, [bookings, tab])

  const handleCancel = (id: string) => {
    if (!window.confirm('Cancel this booking?')) return
    cancelBooking(id)
    setBookings(getBookings())
  }

  return (
    <div className="min-h-screen bg-paper-dim pb-20">
      <Container className="py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-signal-700">
              Your journeys
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-950">My bookings</h1>
            <p className="mt-1 text-sm text-ink-500">
              Everything you have booked with NEXTRIP, in one place.
            </p>
          </div>
          <Button asChild variant="signal">
            <Link to="/">Book another trip</Link>
          </Button>
        </div>

        {bookings.length === 0 ? (
          <Card className="mt-8 flex flex-col items-center px-6 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal-50 text-signal-700">
              <Ticket className="h-6 w-6" />
            </span>
            <h2 className="mt-5 font-display text-xl font-semibold">No bookings yet</h2>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
              Your confirmed journeys will appear here after you complete a booking.
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Find a trip</Link>
            </Button>
          </Card>
        ) : (
          <div className="mt-8">
            <div className="mb-5 flex flex-wrap gap-2">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
                    tab === item
                      ? 'bg-ink-950 text-white'
                      : 'bg-white text-ink-500 hover:bg-paper-dim'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <Card className="flex flex-col items-center px-6 py-16 text-center">
                <p className="font-display text-lg font-semibold">
                  No {tab === 'all' ? '' : tab} bookings
                </p>
                <p className="mt-2 text-sm text-ink-500">Try another booking category.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {visible.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-6">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal-50 text-signal-700">
                        <ModeIcon mode={booking.trip.mode} className="h-5 w-5" />
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-ink-950">{booking.trip.operator}</p>
                          <Badge variant="signal">{booking.status}</Badge>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-500">
                          <span>{booking.trip.departureTime}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                          <span>{booking.trip.arrivalTime}</span>
                          <span className="text-ink-300">·</span>
                          <span>{booking.seats.join(', ')}</span>
                        </div>

                        <div className="mt-2 flex items-center gap-2 text-xs text-ink-400">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>Booking {booking.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p className="font-display text-xl font-semibold">
                          ₹{booking.total.toLocaleString('en-IN')}
                        </p>
                        <div className="flex gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/confirmation/${booking.id}`}>View ticket</Link>
                          </Button>
                          {booking.status === 'Upcoming' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancel(booking.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

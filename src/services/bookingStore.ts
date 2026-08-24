import type { TripResult } from '@/types/results'

export type TransactionStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded'

export interface TransactionRecord {
  id: string
  bookingId: string
  method: string
  amount: number
  status: TransactionStatus
  createdAt: string
}

export interface BookingRecord {
  id: string
  status: 'Upcoming' | 'Completed' | 'Cancelled'
  trip: TripResult
  seats: string[]
  passengers: { name: string; age: string; gender: string }[]
  total: number
  bookedAt: string
  transactionId?: string
}

const SELECTED_TRIP_KEY = 'nextrip:selected-trip'
const BOOKINGS_KEY = 'nextrip:bookings'
const TRANSACTIONS_KEY = 'nextrip:transactions'

export function saveSelectedTrip(trip: TripResult) {
  sessionStorage.setItem(SELECTED_TRIP_KEY, JSON.stringify(trip))
}

export function getSelectedTrip(): TripResult | null {
  try {
    const value = sessionStorage.getItem(SELECTED_TRIP_KEY)
    return value ? (JSON.parse(value) as TripResult) : null
  } catch {
    return null
  }
}

export function getBookings(): BookingRecord[] {
  try {
    const value = localStorage.getItem(BOOKINGS_KEY)
    return value ? (JSON.parse(value) as BookingRecord[]) : []
  } catch {
    return []
  }
}

export function saveBooking(booking: BookingRecord) {
  const bookings = getBookings()
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...bookings]))
}

export function getTransactions(): TransactionRecord[] {
  try {
    const value = localStorage.getItem(TRANSACTIONS_KEY)
    return value ? (JSON.parse(value) as TransactionRecord[]) : []
  } catch {
    return []
  }
}

export function saveTransaction(transaction: TransactionRecord) {
  const transactions = getTransactions()
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([transaction, ...transactions]))
}

export function cancelBooking(id: string) {
  const bookings = getBookings().map((booking) => booking.id === id ? { ...booking, status: 'Cancelled' as const } : booking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
}

export function clearBookings() {
  localStorage.removeItem(BOOKINGS_KEY)
  localStorage.removeItem(TRANSACTIONS_KEY)
}

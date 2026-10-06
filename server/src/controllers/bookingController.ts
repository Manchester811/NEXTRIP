import { Request, Response } from 'express'
import { prisma } from '../utils/prisma.js'
import { AppError } from '../middleware/errorHandler.js'
import { AuthRequest } from '../middleware/auth.js'
import { bookingSchema, cancelBookingSchema } from '../utils/validators.js'
import { randomBytes } from 'crypto'

function generateBookingId(): string {
  return 'BK' + randomBytes(4).toString('hex').toUpperCase()
}

function generateTransactionId(): string {
  return 'TXN' + randomBytes(6).toString('hex').toUpperCase()
}

export async function createBooking(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')
  
  const data = bookingSchema.parse(req.body)
  const { tripId, seats, passengers } = data

  const trip = await prisma.trip.findUnique({ where: { id: tripId } })
  if (!trip) throw new AppError(404, 'Trip not found')

  if (trip.seatsAvailable !== null && trip.seatsAvailable < seats.length) {
    throw new AppError(400, 'Not enough seats available')
  }

  const total = trip.price * seats.length
  const bookingId = generateBookingId()

  const booking = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        id: bookingId,
        userId: req.user!.userId,
        tripId,
        seats,
        passengers,
        total,
        status: 'UPCOMING',
      },
      include: { trip: true },
    })

    if (trip.seatsAvailable !== null) {
      await tx.trip.update({
        where: { id: tripId },
        data: { seatsAvailable: trip.seatsAvailable - seats.length },
      })
    }

    const transaction = await tx.transaction.create({
      data: {
        id: generateTransactionId(),
        bookingId: newBooking.id,
        userId: req.user!.userId,
        method: 'card',
        amount: total,
        status: 'SUCCESSFUL',
      },
    })

    await tx.booking.update({
      where: { id: newBooking.id },
      data: { transactionId: transaction.id },
    })

    return newBooking
  })

  res.status(201).json({ booking })
}

export async function getBookings(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')

  const { status } = req.query
  const where: any = { userId: req.user.userId }
  if (status && typeof status === 'string') {
    where.status = status.toUpperCase()
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { trip: true, transaction: true },
    orderBy: { bookedAt: 'desc' },
  })

  res.json({ bookings })
}

export async function getBooking(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')

  const { id } = req.params
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { trip: true, transaction: true },
  })

  if (!booking) throw new AppError(404, 'Booking not found')
  if (booking.userId !== req.user.userId) throw new AppError(403, 'Not authorized')

  res.json({ booking })
}

export async function cancelBooking(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')

  const data = cancelBookingSchema.parse(req.body)
  const { bookingId } = data

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { trip: true },
  })

  if (!booking) throw new AppError(404, 'Booking not found')
  if (booking.userId !== req.user.userId) throw new AppError(403, 'Not authorized')
  if (booking.status === 'CANCELLED') throw new AppError(400, 'Already cancelled')

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    })

    if (booking.trip.seatsAvailable !== null) {
      await tx.trip.update({
        where: { id: booking.tripId },
        data: { seatsAvailable: booking.trip.seatsAvailable + booking.seats.length },
      })
    }

    if (booking.transactionId) {
      await tx.transaction.update({
        where: { id: booking.transactionId },
        data: { status: 'REFUNDED' },
      })
    }
  })

  res.json({ message: 'Booking cancelled successfully' })
}
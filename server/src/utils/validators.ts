import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const searchSchema = z.object({
  mode: z.enum(['bus', 'train', 'flight', 'cab', 'metro', 'ferry']),
  origin: z.string().min(1),
  destination: z.string().min(1),
  departDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  returnDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  adults: z.coerce.number().int().min(1).max(9).default(1),
  children: z.coerce.number().int().min(0).max(9).default(0),
  infants: z.coerce.number().int().min(0).max(9).default(0),
  travelClass: z.string().optional(),
})

export const bookingSchema = z.object({
  tripId: z.string().cuid(),
  seats: z.array(z.string()).min(1),
  passengers: z.array(z.object({
    name: z.string().min(1),
    age: z.number().int().min(0).max(120),
    gender: z.enum(['male', 'female', 'other']),
  })).min(1),
})

export const cancelBookingSchema = z.object({
  bookingId: z.string().cuid(),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
})
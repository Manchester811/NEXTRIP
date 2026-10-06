import { Router } from 'express'
import { createBooking, getBookings, getBooking, cancelBooking } from '../controllers/bookingController.js'
import { authenticate } from '../middleware/auth.js'
import { bookingSchema, cancelBookingSchema } from '../utils/validators.js'
import { validate } from '../middleware/validate.js'

export const bookingsRouter = Router()

bookingsRouter.use(authenticate)

bookingsRouter.post('/', validate(bookingSchema), createBooking)
bookingsRouter.get('/', getBookings)
bookingsRouter.get('/:id', getBooking)
bookingsRouter.post('/cancel', validate(cancelBookingSchema), cancelBooking)
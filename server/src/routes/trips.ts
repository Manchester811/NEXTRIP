import { Router } from 'express'
import { searchTrips, getTrip, getPopularRoutes } from '../controllers/tripController.js'
import { optionalAuth } from '../middleware/auth.js'
import { searchSchema } from '../utils/validators.js'
import { validate } from '../middleware/validate.js'

export const tripsRouter = Router()

tripsRouter.get('/search', optionalAuth, validate(searchSchema), searchTrips)
tripsRouter.get('/popular', getPopularRoutes)
tripsRouter.get('/:id', getTrip)
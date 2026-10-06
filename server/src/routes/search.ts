import { Router } from 'express'
import { logSearch, getSearchHistory, getDestinations } from '../controllers/searchController.js'
import { optionalAuth, authenticate } from '../middleware/auth.js'
import { searchSchema } from '../utils/validators.js'
import { validate } from '../middleware/validate.js'

export const searchRouter = Router()

searchRouter.get('/destinations', getDestinations)
searchRouter.post('/log', optionalAuth, validate(searchSchema), logSearch)
searchRouter.get('/history', authenticate, getSearchHistory)
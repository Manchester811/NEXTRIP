import { Router } from 'express'
import { getProfile, updateProfile, getTransactions } from '../controllers/userController.js'
import { authenticate } from '../middleware/auth.js'
import { profileUpdateSchema } from '../utils/validators.js'
import { validate } from '../middleware/validate.js'

export const usersRouter = Router()

usersRouter.use(authenticate)

usersRouter.get('/profile', getProfile)
usersRouter.patch('/profile', validate(profileUpdateSchema), updateProfile)
usersRouter.get('/transactions', getTransactions)
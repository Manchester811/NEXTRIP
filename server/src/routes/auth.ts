import { Router } from 'express'
import { register, login, logout, me, updateProfile } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { registerSchema, loginSchema, profileUpdateSchema } from '../utils/validators.js'
import { validate } from '../middleware/validate.js'

export const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)
authRouter.post('/logout', authenticate, logout)
authRouter.get('/me', authenticate, me)
authRouter.patch('/profile', authenticate, validate(profileUpdateSchema), updateProfile)
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'
import { registerSchema, loginSchema } from '../utils/validators.js'
import { AppError } from '../middleware/errorHandler.js'
import { AuthRequest } from '../middleware/auth.js'

export async function register(req: Request, res: Response) {
  const data = registerSchema.parse(req.body)

  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new AppError(409, 'Email already registered')

  const passwordHash = await hashPassword(data.password)
  const user = await prisma.user.create({
    data: { email: data.email, name: data.name, passwordHash },
    select: { id: true, email: true, name: true, createdAt: true },
  })

  const token = generateToken({ userId: user.id, email: user.email, name: user.name })
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  })

  res.status(201).json({ user, token })
}

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body)

  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user) throw new AppError(401, 'Invalid credentials')

  const valid = await verifyPassword(data.password, user.passwordHash)
  if (!valid) throw new AppError(401, 'Invalid credentials')

  const token = generateToken({ userId: user.id, email: user.email, name: user.name })
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: { userId: user.id, token, expiresAt },
  })

  res.json({
    user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    token,
  })
}

export async function logout(req: AuthRequest, res: Response) {
  const token = req.headers.authorization?.slice(7)
  if (token) {
    await prisma.session.deleteMany({ where: { token } })
  }
  res.json({ message: 'Logged out' })
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Not authenticated')
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  })
  if (!user) throw new AppError(404, 'User not found')
  res.json({ user })
}

export async function updateProfile(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Not authenticated')
  const data = req.body
  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { name: data.name, email: data.email },
    select: { id: true, email: true, name: true, createdAt: true },
  })
  res.json({ user })
}
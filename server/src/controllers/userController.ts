import { Request, Response } from 'express'
import { prisma } from '../utils/prisma.js'
import { AppError } from '../middleware/errorHandler.js'
import { AuthRequest } from '../middleware/auth.js'
import { profileUpdateSchema } from '../utils/validators.js'

export async function getProfile(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      _count: { select: { bookings: true, transactions: true } },
    },
  })

  if (!user) throw new AppError(404, 'User not found')
  res.json({ user })
}

export async function updateProfile(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')

  const data = profileUpdateSchema.parse(req.body)

  if (data.email && data.email !== req.user.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new AppError(409, 'Email already in use')
  }

  const user = await prisma.user.update({
    where: { id: req.user.userId },
    data: { name: data.name, email: data.email },
    select: { id: true, email: true, name: true, createdAt: true },
  })

  res.json({ user })
}

export async function getTransactions(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')

  const transactions = await prisma.transaction.findMany({
    where: { userId: req.user.userId },
    include: { booking: { include: { trip: true } } },
    orderBy: { createdAt: 'desc' },
  })

  res.json({ transactions })
}
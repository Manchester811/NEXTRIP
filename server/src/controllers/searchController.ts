import { Request, Response } from 'express'
import { prisma } from '../utils/prisma.js'
import { AppError } from '../middleware/errorHandler.js'
import { AuthRequest } from '../middleware/auth.js'
import { searchSchema } from '../utils/validators.js'

export async function logSearch(req: AuthRequest, res: Response) {
  const params = searchSchema.parse(req.query)

  if (req.user) {
    await prisma.searchLog.create({
      data: {
        userId: req.user.userId,
        mode: params.mode,
        origin: params.origin,
        destination: params.destination,
        departDate: new Date(params.departDate),
        returnDate: params.returnDate ? new Date(params.returnDate) : null,
        passengers: {
          adults: params.adults ?? 1,
          children: params.children ?? 0,
          infants: params.infants ?? 0,
        },
        travelClass: params.travelClass,
        resultsCount: 0,
      },
    })
  }

  res.json({ success: true })
}

export async function getSearchHistory(req: AuthRequest, res: Response) {
  if (!req.user) throw new AppError(401, 'Authentication required')

  const history = await prisma.searchLog.findMany({
    where: { userId: req.user.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  res.json({ history })
}

export async function getDestinations(req: Request, res: Response) {
  const { query } = req.query
  const where = query && typeof query === 'string' ? {
    OR: [
      { origin: { contains: query, mode: 'insensitive' as const } },
      { destination: { contains: query, mode: 'insensitive' as const } },
    ],
  } : {}

  const destinations = await prisma.trip.findMany({
    where,
    select: { origin: true, destination: true, mode: true },
    distinct: ['origin', 'destination'],
    take: 50,
  })

  const unique = Array.from(
    new Map(destinations.map(d => [`${d.origin}|${d.destination}|${d.mode}`, d])).values()
  )

  res.json({ destinations: unique })
}
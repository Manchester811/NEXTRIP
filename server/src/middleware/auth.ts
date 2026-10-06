import { Request, Response, NextFunction } from 'express'
import { verifyToken, extractTokenFromHeader, JwtPayload } from '../utils/jwt.js'
import { prisma } from '../utils/prisma.js'

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = extractTokenFromHeader(req.headers.authorization)
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return res.status(401).json({ error: 'Session expired' })
  }

  req.user = payload
  next()
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const token = extractTokenFromHeader(req.headers.authorization)
  if (token) {
    const payload = verifyToken(token)
    if (payload) req.user = payload
  }
  next()
}
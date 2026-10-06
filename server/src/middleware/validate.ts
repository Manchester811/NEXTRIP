import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { AppError } from './errorHandler.js'

export const validate = (schema: AnyZodObject) => 
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new AppError(400, 'Validation failed', err.flatten().fieldErrors))
      }
      next(err)
    }
  }
import { Request, Response, NextFunction } from 'express'
import logger from './logger'

class ErrorHandler extends Error {
  constructor (public statusCode: number, public message: string) {
    super()
  }
}

function handleError (err: ErrorHandler, req: Request, res: Response, next: NextFunction) {
  const { statusCode, message } = err
  logger.error({ statusCode, message })
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  })
};

export { handleError, ErrorHandler }

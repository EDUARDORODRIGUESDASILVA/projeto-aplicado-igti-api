import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'

import db from './db.config'
import Produto from './models/Produto'

const isDev = process.env.NODE_ENV === 'development'

async function sync (req: Request, res: Response, next: NextFunction) {
  console.log('NODE_ENV:', process.env.NODE_ENV)
  try {
    await db.authenticate()
    logger.info('Connection has been established successfully.')
  } catch (error) {
    logger.info('Unable to connect to the database:', error)
  }

  try {
    await Produto.sync({ alter: isDev })
    await db.sync()
  } catch (error) {
    logger.info('Unable to sync database', error)
  }
  next()
}
export default sync

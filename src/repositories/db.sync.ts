import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'

import db from './db.config'

const isDev = process.env.NODE_ENV === 'development'

async function sync (req: Request, res: Response, next: NextFunction) {
  try {
    await db.authenticate()
    logger.info('Connection has been established successfully.')
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }

  try {
    const sync = false
    if (sync && isDev) {
      // await ObjetivoPorUnidade.sync({ alter: isDev, force: false })
      // await Produto.sync({ alter: isDev, force: false })
      // await Unidade.sync({ alter: isDev })
      // await Usuario.sync({ alter: isDev })
      // await db.sync()
    }
  } catch (error) {
    logger.error('Unable to sync database', error)
  }
  next()
}
export default sync

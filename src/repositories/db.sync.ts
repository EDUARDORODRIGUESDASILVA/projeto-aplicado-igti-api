import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'

import db from './db.config'
// import Troca from './models/Troca'
// import Usuario from './models/Usuario'
// import ObjetivoPorUnidade from './models/ObjetivoPorUnidade'
// import Produto from './models/Produto'
// import Unidade from './models/Unidade'
// import Usuario from './models/Usuario'

const isDev = process.env.NODE_ENV === 'development'

async function sync (req: Request, res: Response, next: NextFunction) {
  try {
    await db.authenticate()
    logger.info('Connection has been established successfully.')
  } catch (error) {
    logger.error('Unable to connect to the database:', error)
  }

  try {
    const sync = true
    if (sync && isDev) {
      // await Produto.sync({ alter: isDev, force: false })
      // await Unidade.sync({ alter: isDev, force: false })
      // await Usuario.sync({ alter: isDev, force: true })
      // await ObjetivoPorUnidade.sync({ alter: isDev, force: false })
      // await Troca.sync({ alter: isDev, force: true })
      await db.sync()
    }
  } catch (error) {
    console.log(error)
    logger.error('Unable to sync database', error)
  }
  next()
}
export default sync

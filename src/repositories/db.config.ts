import { Dialect, Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import logger from '../lib/logger'

dotenv.config()

function createConnection (): Sequelize {
  const dbDriver = process.env.DB_DRIVER as Dialect

  const dbName = process.env.DB_NAME as string

  if (dbDriver === 'mssql') {
    const dbUser = process.env.DB_USER as string
    const dbHost = process.env.DB_HOST
    const dbPassword = process.env.DB_PASSWORD
    return new Sequelize(dbName, dbUser, dbPassword, {

      host: dbHost,
      dialect: dbDriver,
      define: {
        timestamps: true
      },
      logging: (msg) => logger.debug(msg)
    })
  }

  return new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
  })
}

const sequelizeConnection = createConnection()

export default sequelizeConnection

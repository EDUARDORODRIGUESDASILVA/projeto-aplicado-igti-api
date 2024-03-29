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
  if (dbDriver === 'postgres') {
    const connstring = process.env.DB_CONNECTION_STRING as string
    return new Sequelize(connstring,
      {
        dialect: dbDriver,
        define: {
          timestamps: false
        },
        logging: (msg) => logger.debug(msg)
      })
  }

  if (dbDriver === 'mysql') {
    const connstring = process.env.DB_CONNECTION_STRING as string
    return new Sequelize(connstring,
      {
        dialect: 'mysql',
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false
          }
        },
        define: {
          timestamps: false
        },
        logging: (msg) => logger.debug(msg)
      })
  }

  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQL_LITE_STORAGE
  })
}

const sequelizeConnection = createConnection()

export default sequelizeConnection

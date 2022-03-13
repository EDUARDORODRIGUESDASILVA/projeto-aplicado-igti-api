import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import logger from './lib/logger'
import sync from './repositories/db.sync'
// import { basicAuth } from './lib/auth.middleware'
import routes from './routes'
dotenv.config()

if (!process.env.PORT) {
  process.exit(1)
}

const PORT: number = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(sync)

app.get('/', (req: any, res: any) => {
  res.send('IGTI Projeto Aplicado: Desenvolvedor Full Stack - Backend Node JS - Eduardo Rodrigues da Silva')
  logger.http('GET /')
})

// autenticação
// app.use(basicAuth)
// app.use('/api/v1', routes)
app.use('/api/v1', routes)

// app.use(handleError)
app.use((err: any, req: any, res: any, next: any) => {
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Ocorreu um erro, tente novamente mais tarde.'
  })
  logger.error({ erro: JSON.stringify(err) })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

// logger.error('This is an error log')
// logger.warn('This is a warn log')
// logger.info('This is a info log')
// logger.debug('This is a debug log')

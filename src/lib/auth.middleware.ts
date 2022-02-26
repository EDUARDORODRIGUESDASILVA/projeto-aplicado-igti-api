
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
import logger from './logger'
dotenv.config()

interface User {
  username: string;
  role: string[];
}

export interface CustomRequest extends Request {
  user?: User,
  // foo?: string;
  // bar?: number;
}

async function basicAuth (req: CustomRequest, res: Response, next: NextFunction) {
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({ error: 'Missing Authorization Header' })
  }

  const base64Credentials = req.headers.authorization.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
  const [username, password] = credentials.split(':')

  const isAdmin = authAdmin(username, password)

  const user: User = { username, role: [] }
  if (isAdmin) {
    user.role = ['admin']
    req.user = user
    logger.info('Logged as admin')
    return next()
  }
  res.status(401).json({ message: 'Invalid Authentication Credencials' })
  return next()

  // TODO ADICIONAR SERVICO DE USUARIOS
  // JSON.parse(JSON.stringify(await clienteService.authenticateCliente(username, password)))

  // if (!user) {
  //   logger.info(`Invalid Authentication as ${username}`)
  //   return res.status(401).json({ message: 'Invalid Authentication Credencials' })
  // }

  // user.role = 'customer1'
}

function authAdmin (username: string, password: string) {
  const adminUser = process.env.ROOT_USER
  const adminPassword = process.env.ROOT_PASS

  if (adminUser === username && adminPassword === password) {
    return true
  }
  return false
}

function authorize (...allowed: string[]) {
  const isAllowed = (role: string) => allowed.indexOf(role) > -1

  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user) {
      const roles = req.user.role
      roles.forEach(role => {
        isAllowed(role)
        next()
      })
      res.status(401).json({ error: `${req.user.username} has no allowd roles` })
    } else {
      res.status(403).json({ error: 'User not found' })
    }
  }
}

export { basicAuth, authorize }

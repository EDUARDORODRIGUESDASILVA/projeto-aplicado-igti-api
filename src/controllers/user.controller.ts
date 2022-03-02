import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'
import userService from '../services/user.service'
async function getByMatricula (req: Request, res: Response, next: NextFunction) {
  try {
    const matricula = req.params.matricula
    const c = await userService.getUserByMatricula(matricula)
    return res.status(200).send(c)
  } catch (error) {
    next(error)
  }
}

async function getLoggedUser (req: Request, res: Response, next: NextFunction) {
  try {
    const c = await userService.getLoggedUser()
    return res.status(200).send(c)
  } catch (error: Error | any) {
    logger.error('Falha ao autenticar', error)
    return res.status(403)
  }
}

export default {
  getLoggedUser, getByMatricula
}

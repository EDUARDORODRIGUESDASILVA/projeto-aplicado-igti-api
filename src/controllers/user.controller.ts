import { Request, Response, NextFunction } from 'express'
import { check, validationResult } from 'express-validator'
import IUser from '../core/interfaces/IUser'
import logger from '../lib/logger'
import userService from '../services/user.service'

async function getUsersByAutorizacao (req: Request, res: Response, next: NextFunction) {
  try {
    // const c = await userService.getLoggedUser()
    const users = await userService.getUsersByAutorizacao(2625)
    return res.status(200).send(users)
  } catch (error: Error | any) {
    logger.error('[USER] Falha ao buscar usuários', error)
    return res.status(403).send({ msg: 'Falha ao buscar usuários' })
  }
}
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
    logger.error('[USER] Falha ao autenticar', error)
    return res.status(403).send({ msg: 'Usuário não identificado' })
  }
}

async function create (req: Request, res: Response, next: NextFunction) {
  try {
    await check('matricula', 'matricula deve ser informada').notEmpty().run(req)
    await check('nome', 'nome deve ser informado').notEmpty().run(req)
    await check('funcao', 'funcao deve ser informado').notEmpty().run(req)
    await check('unidadeId', 'icOrdem deve ser um número inteiro').notEmpty().isInt().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IUser = req.body
    const c = await userService.createUser(input)
    return res.status(201).json(c)
  } catch (error: Error | any) {
    logger.error('[USER] Falha ao criar usuario', error)
    return res.status(500).send({ msg: 'Falha ao criar usuário' })
  }
}

async function update (req: Request, res: Response, next: NextFunction) {
  try {
    await check('matricula', 'matricula deve ser informada').notEmpty().run(req)
    await check('nome', 'nome deve ser informado').notEmpty().run(req)
    await check('funcao', 'funcao deve ser informado').notEmpty().run(req)
    await check('unidadeId', 'icOrdem deve ser um número inteiro').notEmpty().isInt().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IUser = req.body
    const c = await userService.update(input)
    return res.status(200).json(c)
  } catch (error) {
    logger.error('[USER] Falha ao atualizar o usuario', error)
    return res.status(500).send({ msg: 'Falha ao atualizar o usuário' })
    //   next(error)
  }
}

async function destroy (req: Request, res: Response, next: NextFunction) {
  try {
    const matricula = req.params.matricula
    const c = await userService.deleteByMatricula(matricula)
    return res.status(200).send(c)
  } catch (error) {
    return res.status(500).send({ msg: 'Falha ao excluir o usuário' })
  }
}

export default {
  getLoggedUser, getByMatricula, create, update, destroy, getUsersByAutorizacao
}

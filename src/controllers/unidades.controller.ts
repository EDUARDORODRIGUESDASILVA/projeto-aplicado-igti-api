import { check, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'
import unidadeService from '../services/unidade.service'
import IUnidade from '../core/interfaces/IUnidade'
import { IUnidadeQueryInput } from '../repositories/unidade.repository'

async function create (req: Request, res: Response, next: NextFunction) {
  try {
    await check('id', 'o id (CGC) da unidade deve ser informado').notEmpty().isInt().run(req)
    await check('nome', 'nome da unidade deve ser informado').notEmpty().run(req)
    await check('tipo', 'o tipo deve ser informado').notEmpty().run(req)
    await check('porte', 'o porte deve ser informado').notEmpty().isInt().run(req)
    await check('cluster', 'O cluster da unidade deve ser informado').notEmpty().run(req)
    await check('nivel', 'O nível da unidade deve ser informado').notEmpty().isInt().run(req)
    await check('se', 'O código da SE deve ser int').isInt().run(req)
    await check('sr', 'O código da SR deve ser int').isInt().run(req)
    await check('vinc', 'O código da vin deve ser int').isInt().run(req)
    await check('rede', 'A rede deve ser informada').notEmpty().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IUnidade = req.body
    const c = await unidadeService.create(input)
    return res.status(201).json(c)
  } catch (error) {
    logger.error('[UNIDADE] Falha ao criar a unidade', error)
    return res.status(500).send({ msg: 'Falha ao criar a unidade' })
    //  next(error)
  }
}

async function update (req: Request, res: Response, next: NextFunction) {
  try {
    await check('id', 'o id (CGC) da unidade deve ser informado').notEmpty().isInt().run(req)
    await check('nome', 'nome da unidade deve ser informado').notEmpty().run(req)
    await check('tipo', 'o tipo deve ser informado').notEmpty().run(req)
    await check('porte', 'o porte deve ser informado').notEmpty().isInt().run(req)
    await check('cluster', 'O cluster da unidade deve ser informado').notEmpty().run(req)
    await check('nivel', 'O nível da unidade deve ser informado').notEmpty().isInt().run(req)
    await check('se', 'O código da SE deve ser int').isInt().run(req)
    await check('sr', 'O código da SR deve ser int').isInt().run(req)
    await check('vinc', 'O código da vin deve ser int').isInt().run(req)
    await check('rede', 'A rede deve ser informada').notEmpty().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IUnidade = req.body
    const c = await unidadeService.update(input)
    return res.status(200).json(c)
  } catch (error) {
    logger.error('[UNIDADE] Falha ao atualizar o unidade', error)
    return res.status(500).send({ msg: 'Falha ao atualizar a unidade' })
    // next(error)
  }
}

async function getById (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const c = await unidadeService.getById(id)
    return res.status(200).send(c)
  } catch (error) {
    next(error)
  }
}

async function getByQueryParams (req: Request, res: Response, next: NextFunction) {
  try {
    const query: IUnidadeQueryInput = {}
    if (req.query.sr as string) {
      query.sr = parseInt(req.query.sr as string)
    }

    if (req.query.se as string) {
      query.se = parseInt(req.query.se as string)
    }
    if (req.query.vinc as string) {
      query.vinc = parseInt(req.query.vinc as string)
    }

    if (req.query.nivel as string) {
      query.nivel = parseInt(req.query.nivel as string)
    }

    console.log('query params', req.query, query)
    const unidades = await unidadeService.getByQuery(query)
    return res.status(200).send(unidades)
  } catch (error) {
    next(error)
  }
}

async function deleteById (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const c = await unidadeService.deleteById(id)
    return res.status(200).send(c)
  } catch (error) {
    logger.error('[USER] Falha ao deletar a unidade', error)
    return res.status(500).send({ msg: 'Falha ao deletar a unidade' })
    // next(error)
  }
}

export default {
  create,
  update,
  getById,
  deleteById,
  getByQueryParams
}

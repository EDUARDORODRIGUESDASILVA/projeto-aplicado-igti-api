
import { check, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'
import { IObjetivoUnidade } from '../core/interfaces/IObjetivoUnidade'
import objetivoService from '../services/objetivo.service'
import { IObjetivoQueryInput, IUpdateObjetivoLoteInput } from '../repositories/objetivo.repository'

async function create (req: Request, res: Response, next: NextFunction) {
  try {
    await check('produtoId', 'O id do produto deve ser informado').notEmpty().isInt().run(req)
    await check('unidadeId', 'O id da unidade deve ser informado').notEmpty().run(req)
    await check('metaReferencia', 'A meta de referencia deve ser informada').notEmpty().isFloat().run(req)
    await check('metaReferencia2', 'A meta de referencia2 deve ser informada').notEmpty().isFloat().run(req)
    await check('metaMinima', 'A meta mínima deve ser informada').notEmpty().isFloat().run(req)
    await check('trocas', 'A total das trocas deve ser informado').notEmpty().isFloat().run(req)
    await check('trava', 'A trava deve ser informada').notEmpty().run(req)
    await check('erros', 'A quantidade de erros deve ser informada').notEmpty().isInt().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IObjetivoUnidade = req.body
    // return res.status(201).json(input)

    const c = await objetivoService.create(input)
    return res.status(201).json(c)
  } catch (error) {
    logger.error('[USER] Falha ao criar o objetivo', error)

    return res.status(500).send(error)
    // return res.status(500).send({ msg: 'Falha ao criar o objetivo' })
    //  next(error)
  }
}

async function update (req: Request, res: Response, next: NextFunction) {
  try {
    await check('id', 'O id do objetivo deve ser informado').notEmpty().isInt().run(req)
    await check('produtoId', 'O id do produto deve ser informado').notEmpty().isInt().run(req)
    await check('unidadeId', 'O id da unidade deve ser informado').notEmpty().run(req)
    await check('metaReferencia', 'A meta de referencia deve ser informada').notEmpty().isFloat().run(req)
    await check('metaReferencia2', 'A meta de referencia2 deve ser informada').notEmpty().isFloat().run(req)
    await check('metaMinima', 'A meta mínima deve ser informada').notEmpty().isFloat().run(req)
    await check('trocas', 'A total das trocas deve ser informado').notEmpty().isFloat().run(req)
    await check('trava', 'A trava deve ser informada').notEmpty().run(req)
    await check('erros', 'A quantidade de erros deve ser informada').notEmpty().isInt().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IObjetivoUnidade = req.body
    const c = await objetivoService.update(input)
    return res.status(201).json(c)
  } catch (error) {
    logger.error('[USER] Falha ao criar o objetivo', error)
    return res.status(500).send({ msg: 'Falha ao criar o objetivo' })
    //  next(error)
  }
}

async function getById (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const c = await objetivoService.getById(id)
    return res.status(200).send(c)
  } catch (error) {
    next(error)
  }
}

async function deleteById (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const c = await objetivoService.deleteById(id)
    return res.status(200).send(c)
  } catch (error) {
    logger.error('[USER] Falha ao deletar o objetivo', error)
    return res.status(500).send({ msg: 'Falha ao deletar o objetivo' })
    // next(error)
  }
}

async function getByQuery (req: Request, res: Response, next: NextFunction) {
  try {
    const query: IObjetivoQueryInput = {}

    if (req.query.vinc as string) {
      query.vinc = parseInt(req.query.vinc as string)
    }

    if (req.query.sr) {
      query.sr = parseInt(req.query.sr as string)
    }

    if (req.query.nivel) {
      query.nivel = parseInt(req.query.nivel as string)
    }

    if (req.query.produtoId) {
      query.produtoId = parseInt(req.query.produtoId as string)
    }

    logger.error(query)

    const c = await objetivoService.getByQuery(query)
    return res.status(200).send(c)
  } catch (error) {
    next(error)
  }
}

async function totalizaAgregador (req: Request, res: Response, next: NextFunction) {
  try {
    const unidadeId = parseInt(req.params.id)

    const c = await objetivoService.totalizaAgregador(unidadeId)
    return res.status(200).send(c)
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function getAjustePorAgregador (req: Request, res: Response, next: NextFunction) {
  try {
    const unidadeId = parseInt(req.params.unidadeId)
    const produtoId = parseInt(req.params.produtoId)
    const c = await objetivoService.getAjustePorAgregador(unidadeId, produtoId)
    return res.status(200).send(c)
  } catch (error) {
    console.log(error)
    next(error)
  }
  return []
}

async function atualizarObjetivosLote (req: Request, res: Response, next: NextFunction) {
  try {
    const unidadeId = parseInt(req.params.unidadeId)
    const produtoId = parseInt(req.params.produtoId)
    const input: IUpdateObjetivoLoteInput[] = req.body
    const c = await objetivoService.updateObjetivoLote(unidadeId, produtoId, input)
    return res.status(200).send(c)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
export default {
  create,
  update,
  getById,
  deleteById,
  getByQuery,
  totalizaAgregador,
  getAjustePorAgregador,
  atualizarObjetivosLote
}

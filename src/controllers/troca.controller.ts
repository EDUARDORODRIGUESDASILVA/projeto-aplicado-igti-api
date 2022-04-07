import { check, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import trocaService, { IRelatorioTrocas } from '../services/troca.service'
import { ITroca } from '../core/interfaces/ITroca'
import logger from '../lib/logger'

async function create (req: Request, res: Response, next: NextFunction) {
  try {
    await check('incrementaId', 'o incrementaId (CGC) da unidade a receber o objetivo deve ser informado').notEmpty().isInt().run(req)
    await check('reduzId', 'o reduzId (CGC) da unidade a reduzir ser informado').notEmpty().isInt().run(req)
    await check('produtoId', 'o id (CGC) da unidade deve ser informado').notEmpty().isInt().run(req)
    await check('valor', 'o valor deve ser informado').notEmpty().isNumeric().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: ITroca = req.body
    const c = await trocaService.create(input)
    return res.status(201).json(c)
  } catch (error) {
    logger.error('[TROCA] Falha ao criar a troca', error)
    return res.status(500).send({ msg: 'Falha ao criar a troca' })
    //  next(error)
  }
}

async function getRelatorio (req: Request, res: Response, next: NextFunction) {
  try {
    const unidadeId = parseInt(req.params.unidadeId)
    const c: IRelatorioTrocas = await trocaService.getRelatorioTrocas(unidadeId)
    return res.status(200).send(c)
  } catch (error) {
    logger.error('[USER] Falha ao ao gerar relatório', error)
    return res.status(500).send({ msg: 'Falha ao gerar relatorio', error })
    //  next(error)
  }
}

async function cancelarTroca (req: Request, res: Response, next: NextFunction) {
  try {
    const unidadeId = parseInt(req.params.unidadeId)
    const c = await trocaService.cancelarTroca(unidadeId)
    return res.status(200).send(c)
  } catch (error) {
    logger.error('[USER] Falha ao ao cancelar troca', error)
    return res.status(500).send({ msg: 'Falha ao cancelar', error })
    //  next(error)
  }
}

async function homologarTroca (req: Request, res: Response, next: NextFunction) {
  try {
    const unidadeId = parseInt(req.params.unidadeId)
    const c = await trocaService.homologarTroca(unidadeId)
    return res.status(200).send(c)
  } catch (error) {
    logger.error('[USER] Falha ao ao homologar troca', error)
    return res.status(500).send({ msg: 'Falha ao homologar', error })
    //  next(error)
  }
}

export default {
  create, getRelatorio, cancelarTroca, homologarTroca
}

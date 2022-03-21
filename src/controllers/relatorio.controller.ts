
import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'
import relatorioService from '../services/relatorio.service'

async function getRelatorio (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.unidadeId)
    const c = await relatorioService.geraRelatorioPorAgregadorProduto(id)
    console.log(c)
    return res.status(200).send(c)
  } catch (error) {
    logger.error('[USER] Falha ao ao gerar relatório', error)
    return res.status(500).send({ msg: 'Falha ao gerar relatorio', error })
    //  next(error)
  }
}

export default {
  getRelatorio
}

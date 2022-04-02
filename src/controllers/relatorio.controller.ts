
import { Request, Response, NextFunction } from 'express'
import logger from '../lib/logger'
import relatorioService, { IRelatorioPorAgregador } from '../services/relatorio.service'

async function getRelatorio (req: Request, res: Response, next: NextFunction) {
  try {
    const unidadeId = parseInt(req.params.unidadeId)
    let c: IRelatorioPorAgregador
    if (req.params.produtoId) {
      const produtoId = parseInt(req.params.produtoId)
      c = await relatorioService.geraRelatorioPorAgregadorProduto(unidadeId, produtoId)
    } else {
      c = await relatorioService.geraRelatorioPorAgregadorProduto(unidadeId)
    }
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

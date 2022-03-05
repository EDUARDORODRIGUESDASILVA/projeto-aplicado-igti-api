import { check, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import produtoService from '../services/produto.service'
import IProduto from '../core/interfaces/IProduto'
import logger from '../lib/logger'

async function create (req: Request, res: Response, next: NextFunction) {
  try {
    await check('nome', 'Nome deve ser informado').notEmpty().run(req)
    await check('codsidem', 'codsidem deve ser informado').notEmpty().run(req)
    await check('ativo', 'ativo deve ser booleano').notEmpty().isBoolean().run(req)
    await check('icOrdem', 'icOrdem deve ser um número inteiro').notEmpty().isInt().run(req)
    await check('bloco', 'Bloco deve ser informado').notEmpty().run(req)
    await check('conquiste', 'Conquiste deve ser informado').notEmpty().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IProduto = req.body
    const c = await produtoService.create(input)
    return res.status(201).json(c)
  } catch (error) {
    logger.error('[USER] Falha ao criar o produto', error)
    return res.status(500).send({ msg: 'Falha ao criar o produto' })
  //  next(error)
  }
}

async function update (req: Request, res: Response, next: NextFunction) {
  try {
    await check('produtoId', 'produtoId deve ser informado').notEmpty().isInt().run(req)
    await check('nome', 'Nome deve ser informado').notEmpty().run(req)
    await check('bloco', 'Bloco deve ser informado').notEmpty().run(req)
    await check('conquiste', 'Bloco deve ser informado').notEmpty().run(req)

    await check('codigo', 'codigo deve ser informado').notEmpty().run(req)
    await check('ativo', 'ativo deve ser booleano').notEmpty().isBoolean().run(req)
    await check('icOrdem', 'icOrdem deve ser um número inteiro').isInt().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: IProduto = req.body
    const c = await produtoService.update(input)
    return res.status(200).json(c)
  } catch (error) {
    logger.error('[USER] Falha ao atualizar o produto', error)
    return res.status(500).send({ msg: 'Falha ao atualizar o produto' })
    // next(error)
  }
}

async function destroy (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const c = await produtoService.deleteById(id)
    return res.status(200).send(c)
  } catch (error) {
    logger.error('[USER] Falha ao deletar o produto', error)
    return res.status(500).send({ msg: 'Falha ao deletar o produto' })
    // next(error)
  }
}

async function getByCodSidem (req: Request, res: Response, next: NextFunction) {
  try {
    const codsidem = req.params.codsidem
    const c = await produtoService.getByCodSidem(codsidem)
    return res.status(200).send(c)
  } catch (error) {
    next(error)
  }
}

async function getAll (req: Request, res: Response, next: NextFunction) {
  try {
    const c = await produtoService.getAll()
    return res.status(200).send(c)
  } catch (error) {
    next(error)
  }
}

export default {
  create, destroy, update, getByCodSidem, getAll
}

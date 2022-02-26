import { check, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { ProdutoInput } from '../repositories/models/Produto'
import produtoService from '../services/produto.service'

async function create (req: Request, res: Response, next: NextFunction) {
  try {
    await check('nome', 'Nome deve ser informado').notEmpty().run(req)
    await check('codigo', 'codigo deve ser informado').notEmpty().run(req)
    await check('ativo', 'ativo deve ser booleano').notEmpty().isBoolean().run(req)
    await check('icOrdem', 'icOrdem deve ser um número inteiro').notEmpty().isInt().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: ProdutoInput = req.body
    const c = await produtoService.create(input)
    return res.status(201).json(c)
  } catch (error) {
    next(error)
  }
}

async function update (req: Request, res: Response, next: NextFunction) {
  try {
    await check('produtoId', 'produtoId deve ser informado').notEmpty().isInt().run(req)
    await check('nome', 'Nome deve ser informado').notEmpty().run(req)
    await check('codigo', 'codigo deve ser informado').notEmpty().run(req)
    await check('ativo', 'ativo deve ser booleano').notEmpty().isBoolean().run(req)
    await check('icOrdem', 'icOrdem deve ser um número inteiro').notEmpty().isInt().run(req)

    const result = validationResult(req)

    if (!result.isEmpty()) {
      res.status(400).json({ erros: result.array() })
      return
    }

    const input: ProdutoInput = req.body
    const c = await produtoService.update(input)
    return res.status(200).json(c)
  } catch (error) {
    next(error)
  }
}

async function destroy (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const c = await produtoService.deleteById(id)
    return res.status(200).send(c)
  } catch (error) {
    next(error)
  }
}

async function getById (req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseInt(req.params.id)
    const c = await produtoService.getById(id)
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
  create, destroy, update, getById, getAll
}

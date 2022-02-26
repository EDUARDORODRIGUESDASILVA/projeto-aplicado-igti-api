import { ProdutoInput } from '../repositories/models/Produto'
import produtoRepository from '../repositories/produto.repository'

async function create (produto: ProdutoInput) {
  return await produtoRepository.create(produto)
}

async function deleteById (produtoId: number) {
  return await produtoRepository.deleteById(produtoId)
}

async function update (produto: ProdutoInput) {
  if (typeof (produto.produtoId) === 'undefined') {
    throw new Error('produtoId must be numeric')
  }

  const id: number = produto.produtoId
  return await produtoRepository.update(id, produto)
}

async function getById (produtoId: number) {
  return await produtoRepository.getById(produtoId)
}

async function getAll () {
  return await produtoRepository.getAll()
}

export default {
  create, deleteById, update, getById, getAll
}

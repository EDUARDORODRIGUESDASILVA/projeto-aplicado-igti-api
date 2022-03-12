import IProduto from '../core/interfaces/IProduto'
// import { ProdutoInput } from '../repositories/models/Produto'
import produtoRepository from '../repositories/produto.repository'

async function create (produto: IProduto) {
  return await produtoRepository.create(produto)
}

async function deleteById (produtoId: number) {
  return await produtoRepository.deleteById(produtoId)
}

async function update (produto: IProduto) {
  const id: number = produto.id
  return await produtoRepository.update(id, produto)
}

async function getByCodSidem (codsidem: string) {
  return await produtoRepository.getByCodSidem(codsidem)
}

async function getById (id: number) {
  return await produtoRepository.getById(id)
}

async function getAll () {
  return await produtoRepository.getAll()
}

export default {
  create, deleteById, update, getByCodSidem, getAll, getById
}

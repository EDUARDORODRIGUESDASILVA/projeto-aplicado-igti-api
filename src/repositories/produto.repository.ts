import Produto, { ProdutoInput } from './models/Produto'
import Iproduto from '../core/interfaces/IProduto'

async function create (produto: Iproduto) {
  return await Produto.create(produto)
}

async function deleteById (produtoId: number): Promise<boolean> {
  const deletedProductCount = await Produto.destroy({
    where: { id: produtoId }
  })
  return !!deletedProductCount
}

async function update (id: number, payload: Partial<ProdutoInput>): Promise<Iproduto> {
  const produto = await Produto.findByPk(id)
  if (!produto) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedProduto = await (produto as Produto).update(payload)
  return updatedProduto
}

async function getById (id: number): Promise<Iproduto> {
  const produto = await Produto.findByPk(id)
  if (!produto) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return produto
}

async function getAll (): Promise<Iproduto[]> {
  return Produto.findAll({}
  )
}

export default {
  create, deleteById, update, getById, getAll
}

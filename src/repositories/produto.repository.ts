import Produto, { ProdutoInput, ProdutoOuput } from './models/Produto'
async function create (produto: ProdutoInput) {
  return await Produto.create(produto)
}

async function deleteById (produtoId: number): Promise<boolean> {
  const deletedProductCount = await Produto.destroy({
    where: { produtoId }
  })
  return !!deletedProductCount
}

async function update (id: number, payload: Partial<ProdutoInput>): Promise<Produto> {
  const produto = await Produto.findByPk(id)
  if (!produto) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedProduto = await (produto as Produto).update(payload)
  return updatedProduto
}

async function getById (id: number): Promise<Produto> {
  const produto = await Produto.findByPk(id)
  if (!produto) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return produto
}

async function getAll () : Promise<Produto[]> {
  return Produto.findAll({}
  )
}

export default {
  create, deleteById, update, getById, getAll
}

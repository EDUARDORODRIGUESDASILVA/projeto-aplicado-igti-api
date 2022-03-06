import Produto, { ProdutoInput } from './models/Produto'
import { IObjetivoUnidade } from '../core/interfaces/IObjetivoUnidade'
import ObjetivoPorUnidade from './models/ObjetivoPorUnidade'
import Unidade from './models/Unidade'

async function create (objetivo: IObjetivoUnidade) {
  return await ObjetivoPorUnidade.create(objetivo)
}

async function deleteById (objetivoId: number): Promise<boolean> {
  const deletedCount = await ObjetivoPorUnidade.destroy({
    where: { id: objetivoId }
  })
  return !!deletedCount
}

async function update (id: number, payload: Partial<ProdutoInput>): Promise<IObjetivoUnidade> {
  const objetivo = await ObjetivoPorUnidade.findByPk(id)
  if (!objetivo) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedObjetivo = await (objetivo as ObjetivoPorUnidade).update(payload)
  return updatedObjetivo
}

async function getByProdutoId (produtoId: number, unidadeId: number): Promise<IObjetivoUnidade> {
  const objetivo = await ObjetivoPorUnidade.findOne(
    {
      where: {
        unidadeId,
        produtoId
      },
      include: [
        {
          model: Unidade
        },
        {
          model: Produto
        }
      ]
    }
  )
  if (!objetivo) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return objetivo
}

async function getById (id: number): Promise<IObjetivoUnidade> {
  const objetivo = await ObjetivoPorUnidade.findByPk(id)
  if (!objetivo) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return objetivo
}

async function getAll (): Promise<IObjetivoUnidade[]> {
  return ObjetivoPorUnidade.findAll({}
  )
}

export default {
  create, deleteById, update, getById, getAll, getByProdutoId
}

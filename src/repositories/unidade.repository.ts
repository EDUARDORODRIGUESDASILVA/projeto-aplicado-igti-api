import IUnidade from '../core/interfaces/IUnidade'
import Unidade from './models/Unidade'

async function getById (id: number): Promise<IUnidade> {
  const unidade = await Unidade.findByPk(id)
  if (!unidade) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return unidade
}

async function create (unidade: IUnidade) {
  return await Unidade.create(unidade)
}

async function update (id: number, payload: IUnidade): Promise<IUnidade> {
  const unidade = await Unidade.findByPk(id)
  if (!unidade) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedUnidade = await (unidade as Unidade).update(payload)
  return updatedUnidade
}

async function deleteById (id: number): Promise<boolean> {
  const deletedUnidadeCount = await Unidade.destroy({
    where: { id }
  })
  return !!deletedUnidadeCount
}

async function getByVincId (vinc: number): Promise<IUnidade[]> {
  return await Unidade.findAll({ where: { vinc } })
}

export default {
  getById, create, update, deleteById, getByVincId
}

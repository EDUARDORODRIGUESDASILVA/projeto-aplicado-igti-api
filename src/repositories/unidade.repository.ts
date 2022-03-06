import IUnidade from '../core/interfaces/IUnidade'
import { IUnidadeQueryInput } from '../services/interfaces/unidade.query.interface.input'
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

async function getByQuery (query: IUnidadeQueryInput): Promise<IUnidade[]> {
  const sr = query.sr
  const nivel = query.nivel
  if (sr) {
    if (nivel) {
      return Unidade.findAll({ where: { sr, nivel } })
    }
    return Unidade.findAll({ where: { sr } })
  }

  const se = query.se
  if (se) {
    return Unidade.findAll({ where: { se } })
  }

  const vinc = query.vinc
  if (vinc) {
    return Unidade.findAll({ where: { vinc } })
  }

  return await Unidade.findAll({})
}

export default {
  getById, create, update, deleteById, getByQuery
}

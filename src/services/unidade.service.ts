import IUnidade from '../core/interfaces/IUnidade'
import unidadeRepository, { IUnidadeQueryInput } from '../repositories/unidade.repository'

async function create (unidade: IUnidade) {
  return await unidadeRepository.create(unidade)
}

async function deleteById (id: number) {
  return await unidadeRepository.deleteById(id)
}

async function update (unidade: IUnidade) {
  const id: number = unidade.id
  return await unidadeRepository.update(id, unidade)
}

async function getById (id: number) {
  return await unidadeRepository.getById(id)
}

async function getByQuery (query: IUnidadeQueryInput) {
  return await unidadeRepository.getByQuery(query)
}

export default {
  create, deleteById, update, getById, getByQuery
}

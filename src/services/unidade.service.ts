import IUnidade from '../core/interfaces/IUnidade'
import unidadeRepository from '../repositories/unidade.repository'

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

async function getByParentId (id: number) {
  return await unidadeRepository.getByVincId(id)
}

export default {
  create, deleteById, update, getById, getByParentId
}

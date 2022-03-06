import { IObjetivoUnidade } from '../core/interfaces/IObjetivoUnidade'
import objetivoRepository from '../repositories/objetivo.repository'
import userService from './user.service'

async function create (objetivo: IObjetivoUnidade) {
  const user = await userService.getLoggedUser()
  // TODO VALIDAR SE USUÁRIO PODE INSERIR OBJETIVO - CONSTRUIR AUTORIZAÇÕES
  objetivo.userId = user.matricula
  return await objetivoRepository.create(objetivo)
}

async function update (objetivo: IObjetivoUnidade) {
  const id: number = objetivo.id
  const user = await userService.getLoggedUser()
  // TODO VALIDAR SE USUÁRIO PODE INSERIR OBJETIVO - CONSTRUIR AUTORIZAÇÕES
  objetivo.userId = user.matricula
  return await objetivoRepository.update(id, objetivo)
}

async function getById (id: number) {
  return await objetivoRepository.getById(id)
}

async function deleteById (id: number) {
  return await objetivoRepository.deleteById(id)
}

async function getAll () {
  return await objetivoRepository.getAll()
}
export default {
  create,
  update,
  getById,
  deleteById,
  getAll

}

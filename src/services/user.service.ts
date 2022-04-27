import IUser from '../core/interfaces/IUser'
import userRepository from '../repositories/user.repository'

async function getUserByMatricula (matricula: string) {
  return await userRepository.getByMatricula(matricula)
}

async function getLoggedUser (): Promise<IUser> {
  const matricula = await (process.env.NODE_ENV === 'development' ? 'D999999' : getNtmlUser())
  return getUserByMatricula(matricula)
}

async function getNtmlUser (): Promise<string> {
  // TODO query NTLM api here
  return await Promise.resolve('C090695')
}

async function getUsersByAutorizacao (unidadeAutorizacaoId: number) {
  // const unidade = await unidadeService.getById(unidadeAutorizacaoId)
  return await userRepository.getUsersByAutorizacao()
}

async function createUser (user: IUser) {
  return await userRepository.create(user)
}

async function update (user: IUser) {
  const matr = user.matricula
  return await userRepository.update(matr, user)
}

async function deleteByMatricula (matricula: string): Promise<boolean> {
  return await userRepository.deleteByMatricula(matricula)
}

export default {
  getUserByMatricula, getLoggedUser, createUser, update, deleteByMatricula, getUsersByAutorizacao
}

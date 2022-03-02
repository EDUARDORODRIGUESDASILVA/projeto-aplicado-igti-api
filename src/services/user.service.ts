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
export default {
  getUserByMatricula, getLoggedUser
}

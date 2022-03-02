import IUser from '../core/interfaces/IUser'
import Usuario from './models/Usuario'

async function getByMatricula (matricula: string): Promise<IUser> {
  const user = await Usuario.findByPk(matricula)
  if (!user) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return user
}

export default {
  getByMatricula
}

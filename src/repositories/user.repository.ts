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

async function create (user: IUser) {
  return await Usuario.create(user)
}

async function update (matricula: string, payload: IUser): Promise<IUser> {
  const user = await Usuario.findByPk(matricula)
  if (!user) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedUser = await (user as Usuario).update(payload)
  return updatedUser
}

async function deleteByMatricula (matricula: string): Promise<boolean> {
  const deletedUserCount = await Usuario.destroy({
    where: { matricula }
  })
  return !!deletedUserCount
}

export default {
  getByMatricula, create, update, deleteByMatricula
}

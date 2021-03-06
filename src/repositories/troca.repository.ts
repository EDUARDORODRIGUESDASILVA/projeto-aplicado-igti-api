import { Op } from 'sequelize'
import { ITroca, TrocaStatus } from '../core/interfaces/ITroca'
import Troca from './models/Troca'
import Usuario from './models/Usuario'

async function getById (id: number): Promise<Troca> {
  const troca = await Troca.findByPk(id, {
    include: [{
      model: Usuario,
      as: 'criador'
    },
    {
      model: Usuario,
      as: 'homologador'
    }]
  })
  if (!troca) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return troca
}

async function create (troca: ITroca) {
  return await Troca.create(troca)
}

async function update (id: number, payload: ITroca): Promise<ITroca> {
  const troca = await Troca.findByPk(id)
  if (!troca) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedTroca = await (troca as Troca).update(payload)
  return updatedTroca
}

async function deleteById (id: number): Promise<boolean> {
  const deletedTrocaCount = await Troca.destroy({
    where: { id }
  })
  return !!deletedTrocaCount
}

export interface ITrocaQueryInput {
  unidadeId?: number
  produtoId?: number
  status?: TrocaStatus
}

async function getTrocas (query: ITrocaQueryInput): Promise<ITroca[]> {
  let where = {}
  if (query.unidadeId) {
    where = {
      [Op.or]: [
        { incrementaId: query.unidadeId },
        { reduzId: query.unidadeId }
      ]
    }
  }
  if (query.produtoId) {
    where = {
      [Op.and]: [
        { produtoId: query.produtoId },
        { ...where }
      ]
    }
  }

  if (query.status) {
    where = {
      [Op.and]: [
        { status: query.status },
        { ...where }
      ]
    }
  }

  return await Troca.findAll(
    {
      where,
      include: [
        {
          model: Usuario,
          as: 'criador'
        },
        {
          model: Usuario,
          as: 'homologador'
        }
      ]
    })
}

export default {
  getById, create, update, deleteById, getTrocas
}

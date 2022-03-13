import Produto, { ProdutoInput } from './models/Produto'
import { IObjetivoUnidade } from '../core/interfaces/IObjetivoUnidade'
import ObjetivoPorUnidade from './models/ObjetivoPorUnidade'
import Unidade from './models/Unidade'
import sequelize from './db.config'
import Usuario from './models/Usuario'
async function create (objetivo: IObjetivoUnidade) {
  return await ObjetivoPorUnidade.create(objetivo)
}

async function deleteById (objetivoId: number): Promise<boolean> {
  const deletedCount = await ObjetivoPorUnidade.destroy({
    where: { id: objetivoId }
  })
  return !!deletedCount
}

async function update (id: number, payload: Partial<ProdutoInput>): Promise<IObjetivoUnidade> {
  const objetivo = await ObjetivoPorUnidade.findByPk(id)
  if (!objetivo) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedObjetivo = await (objetivo as ObjetivoPorUnidade).update(payload)
  return updatedObjetivo
}

async function getByProdutoId (produtoId: number, unidadeId: number): Promise<IObjetivoUnidade> {
  const objetivo = await ObjetivoPorUnidade.findOne(
    {
      where: {
        unidadeId,
        produtoId
      },
      include: [
        {
          model: Unidade
        },
        {
          model: Produto
        }, {
          model: Usuario
        }
      ]
    }
  )
  if (!objetivo) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return objetivo
}

async function getById (id: number): Promise<IObjetivoUnidade> {
  const objetivo = await ObjetivoPorUnidade.findByPk(id)

  if (!objetivo) {
    // @todo throw custom error
    throw new Error('not found')
  }
  return objetivo
}

export interface IQueryTotalizaAgregadorInput {
  vinc?: number,
  produtoId?: number
}
export interface ITotalizaAgregadorOutput {
  metaAjustada: number,
  metaReferencia2: number,
  trocas: number,
  produtoId: number,
  Unidade?: {
    vinc: number
  }
}

async function totalizaAgregador (query: IQueryTotalizaAgregadorInput): Promise<ITotalizaAgregadorOutput[]> {
  const queryUn: { vinc?: number } = {}

  const queryProd: {produtoId?: number} = {}

  if (query.vinc) {
    queryUn.vinc = query.vinc
  }

  if (query.produtoId) {
    queryProd.produtoId = query.produtoId
  }

  const res: ITotalizaAgregadorOutput[] = await ObjetivoPorUnidade.findAll(
    {
      attributes: [
        [sequelize.fn('sum', sequelize.col('metaAjustada')), 'metaAjustada'],
        [sequelize.fn('sum', sequelize.col('metaReferencia2')), 'metaReferencia2'],
        [sequelize.fn('sum', sequelize.col('metaReferencia')), 'metaReferencia'],
        [sequelize.fn('sum', sequelize.col('trocas')), 'trocas'],
        'produtoId'
      ],
      where: queryProd,
      include: [
        { model: Unidade, where: queryUn, attributes: ['vinc'] }
      ],
      group: ['produtoId', 'vinc']
    })

  return res
}

export interface IObjetivoQueryInput {
  vinc?: number
  sr?: number
  se?: number
  nivel?: number
  codsidem?: string
  produtoId?: number
}

async function getByQuery (query: IObjetivoQueryInput): Promise<IObjetivoUnidade[]> {
  const fun: { vinc?: number, sr?: number, nivel?: number } = {}
  if (query.vinc) { fun.vinc = query.vinc }
  if (query.sr) { fun.sr = query.sr }
  if (query.nivel) { fun.nivel = query.nivel }

  const qobj: { produtoId?: number } = {}
  if (query.produtoId) { qobj.produtoId = query.produtoId }

  const qoprod: { codsidem?: string } = {}
  if (query.codsidem) { qoprod.codsidem = query.codsidem }

  return await ObjetivoPorUnidade.findAll({
    where: qobj,
    include: [
      {
        model: Unidade,
        where: fun
      },
      {
        model: Produto
      }, {
        model: Usuario
      }
    ]
  }
  )
}

export default {
  create, deleteById, update, getById, getByQuery, getByProdutoId, totalizaAgregador
}
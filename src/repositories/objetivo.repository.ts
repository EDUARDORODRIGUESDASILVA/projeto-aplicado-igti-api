import Produto from './models/Produto'
import { IObjetivoUnidade } from '../core/interfaces/ObjetivoUnidade'
import ObjetivoPorUnidade from './models/ObjetivoPorUnidade'
import Unidade from './models/Unidade'
import sequelize from './db.config'
import Usuario from './models/Usuario'
import IUser from '../core/interfaces/IUser'

async function create (objetivo: IObjetivoUnidade) {
  const created = await ObjetivoPorUnidade.create(objetivo)
  created.verificaErros()
  await created.save()
  return created
}

async function deleteById (objetivoId: number): Promise<boolean> {
  const deletedCount = await ObjetivoPorUnidade.destroy({
    where: { id: objetivoId }
  })
  return !!deletedCount
}

async function update (id: number, payload: Partial<IObjetivoUnidade>): Promise<IObjetivoUnidade> {
  const objetivo = await ObjetivoPorUnidade.findByPk(id)
  if (!objetivo) {
    // @todo throw custom error
    throw new Error('not found')
  }
  const updatedObjetivo = await (await (objetivo as ObjetivoPorUnidade).update(payload))
  updatedObjetivo.verificaErros()
  updatedObjetivo.save()
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

async function findObjetivo (unidadeId: number, produtoId: number): Promise<ObjetivoPorUnidade | null> {
  const objetivo = await ObjetivoPorUnidade.findOne({
    where: {
      produtoId,
      unidadeId
    }
  }
  )
  return objetivo
}

export interface IQueryFindObjetivos {
  sr?: number,
  nivel?: number,
  produtoId?: number
}
export class FindObjetivosReturn extends ObjetivoPorUnidade {
  Unidade?: Unidade
}
async function findObjetivos (query: IQueryFindObjetivos): Promise<FindObjetivosReturn[]> {
  const queryObjetivo: { produtoId?: number } = {}
  if (query.produtoId) {
    queryObjetivo.produtoId = query.produtoId
  }

  const queryUn: { sr?: number, nivel?: number } = {}
  if (query.sr && query.nivel) {
    queryUn.sr = query.sr
    queryUn.nivel = query.nivel
  }
  const objetivos: FindObjetivosReturn[] = await ObjetivoPorUnidade.findAll({
    where: queryObjetivo,
    include: [
      {
        model: Unidade,
        where: queryUn
      }
    ]
  }
  )
  return objetivos
}

export interface IQueryTotalizaAgregadorInput {
  vinc?: number,
  sr?: number,
  nivel?: number,
  produtoId?: number
  agregador?: number
}
export interface ITotalizaAgregadorOutput {
  metaAjustada: number,
  metaReferencia2: number,
  metaReferencia: number,
  trocas: number,
  produtoId: number,
  erros: number | string,
  qtdlinhas: number | string,
  gravado: number | string,
  'Unidade.sr'?: number,
  'Unidade.vinc'?: number
}

async function totalizaAgregador (query: IQueryTotalizaAgregadorInput): Promise<ITotalizaAgregadorOutput[]> {
  const queryUn: { vinc?: number, sr?: number, nivel?: number } = {}
  const queryProd: { produtoId?: number } = {}
  const columns: string[] = []
  if (query.produtoId) {
    queryProd.produtoId = query.produtoId
  }
  if (query.agregador) {
    queryUn.sr = query.agregador
    columns.push('vinc')
  }
  if (query.sr) {
    queryUn.sr = query.sr
    columns.push('sr')
  }

  if (query.vinc) {
    queryUn.vinc = query.vinc
    columns.push('vinc')
  }

  if (query.nivel) {
    queryUn.nivel = query.nivel
  }
  const res: ITotalizaAgregadorOutput[] = await ObjetivoPorUnidade.findAll(
    {
      attributes: [
        [sequelize.fn('sum', sequelize.col('metaAjustada')), 'metaAjustada'],
        [sequelize.fn('sum', sequelize.col('metaReferencia2')), 'metaReferencia2'],
        [sequelize.fn('sum', sequelize.col('metaReferencia')), 'metaReferencia'],
        [sequelize.fn('sum', sequelize.col('trocas')), 'trocas'],
        [sequelize.fn('sum', sequelize.col('erros')), 'erros'],
        [sequelize.fn('sum', sequelize.col('gravado')), 'gravado'],
        [sequelize.fn('count', sequelize.col('trava')), 'qtdlinhas'],
        'produtoId'
      ],
      raw: true,
      where: queryProd,
      include: [
        {
          model: Unidade,
          where: queryUn,
          attributes: [...columns]
        }
      ],
      group: ['produtoId', ...columns]
    })
  return res
}
export interface IUpdateObjetivoLoteInput {
  id: number,
  metaAjustada: number
  metaReferencia2?: number
}

async function updateObjetivoLote (lote: IUpdateObjetivoLoteInput[], user: IUser) {
  lote.forEach(async (l) => {
    const metaAjustada = l.metaAjustada
    const metaReferencia2 = l.metaReferencia2
    const id = l.id
    const userId = user.matricula

    const atualizacao: any = { metaAjustada, userId, gravado: 1 }
    // todo deixar esse controle dinamico quando tiver tabela de permissoes
    if (typeof (metaReferencia2) === 'number' && user.unidadeId === 2625) {
      atualizacao.metaReferencia2 = metaReferencia2
      atualizacao.gravado = 0
    }
    const objetivo = await ObjetivoPorUnidade.findByPk(id)
    if (objetivo) {
      objetivo.update(atualizacao)
      objetivo.verificaErros()
      objetivo.save()
    }
  })
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
  create,
  deleteById,
  update,
  getById,
  findObjetivo,
  findObjetivos,
  getByQuery,
  getByProdutoId,
  totalizaAgregador,
  updateObjetivoLote
}

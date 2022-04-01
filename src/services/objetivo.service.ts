import { IAjustarProduto } from '../core/interfaces/ajustar/IAjustarProduto'
import { IObjetivoUnidade } from '../core/interfaces/ObjetivoUnidade'
import IProduto from '../core/interfaces/IProduto'
import IUnidade from '../core/interfaces/IUnidade'
import IUser from '../core/interfaces/IUser'
import objetivoRepository, { IObjetivoQueryInput, IQueryTotalizaAgregadorInput, ITotalizaAgregadorOutput, IUpdateObjetivoLoteInput } from '../repositories/objetivo.repository'
import produtoService from './produto.service'
import unidadeService from './unidade.service'
import userService from './user.service'
import ObjetivoPorUnidade from '../repositories/models/ObjetivoPorUnidade'
import { IUnidadeQueryInput } from '../repositories/unidade.repository'

async function create (objetivo: IObjetivoUnidade) {
  const user = await userService.getLoggedUser()
  // TODO VALIDAR SE USUÁRIO PODE INSERIR OBJETIVO - CONSTRUIR AUTORIZAÇÕES
  objetivo.userId = user.matricula
  return await objetivoRepository.create(objetivo)
}

async function update (objetivo: IObjetivoUnidade) {
  const id: number | undefined = objetivo.id
  if (id) {
    const user = await userService.getLoggedUser()
    // TODO VALIDAR SE USUÁRIO PODE INSERIR OBJETIVO - CONSTRUIR AUTORIZAÇÕES
    objetivo.userId = user.matricula
    return await objetivoRepository.update(id, objetivo)
  }

  throw new Error('Id indefinido')
}

async function getById (id: number) {
  return await objetivoRepository.getById(id)
}

async function findObjetivo (unidadeId: number, produtoId: number) {
  return await objetivoRepository.findObjetivo(unidadeId, produtoId)
}
async function deleteById (id: number) {
  return await objetivoRepository.deleteById(id)
}

async function getByQuery (query: IObjetivoQueryInput) {
  return await objetivoRepository.getByQuery(query)
}

async function totalizaAgregador (unidadeId: number) {
  const unidade: IUnidade = await unidadeService.getById(unidadeId)

  const query: IQueryTotalizaAgregadorInput = { }
  if (unidade.tipo === 'SR') {
    query.sr = unidadeId
  } else {
    query.vinc = unidadeId
  }
  return await objetivoRepository.totalizaAgregador(query)
}

async function getAjustePorAgregador (tipo: 'AG' | 'SE', unidadeId: number, produtoId: number): Promise<IAjustarProduto> {
  const unidade: IUnidade = await unidadeService.getById(unidadeId)
  const produto: IProduto = await produtoService.getById(produtoId)

  const query: IQueryTotalizaAgregadorInput = { produtoId }
  if (unidade.tipo === 'SR' && tipo === 'AG') {
    query.sr = unidadeId
  } else {
    query.vinc = unidadeId
  }

  const total: ITotalizaAgregadorOutput[] = await objetivoRepository.totalizaAgregador(query)
  const t = total[0]

  if (unidade.tipo === 'SR' && tipo === 'SE') {
    query.nivel = 3
  }
  if (unidade.tipo === 'SR' && tipo === 'AG') {
    query.nivel = 4
    console.log(query)
  }

  const rows: IObjetivoUnidade[] = await getByQuery(query)
  const userId: IUser = await userService.getLoggedUser()
  const ajuste: IAjustarProduto = {
    id: 0,
    produtoId,
    unidadeId,
    unidade,
    produto,
    metaMinima: 0,
    metaReferencia: t.metaReferencia2,
    metaReferencia2: t.metaReferencia2,
    trocas: 0,
    metaAjustada: t.metaAjustada,
    trava: 'Livre',
    erros: parseInt(t.erros.toString()),
    gravado: parseInt(t.gravado.toString()),
    qtdlinhas: parseInt(t.qtdlinhas.toString()),
    ativo: 1,
    rows,
    userId: userId.matricula
  }

  return ajuste
}

async function createOrUpdateObjetivoAgregador (unidadeId: number, row: ITotalizaAgregadorOutput, user: IUser): Promise<ObjetivoPorUnidade> {
  const produtoId = row.produtoId
  const objetivo: ObjetivoPorUnidade | null = await findObjetivo(unidadeId, produtoId)
  if (objetivo) {
    try {
      objetivo.metaReferencia = row.metaReferencia
      objetivo.metaReferencia2 = row.metaReferencia2
      objetivo.metaAjustada = row.metaAjustada
      objetivo.userId = user.matricula
      objetivo.trocas = row.trocas
      objetivo.save()
      return objetivo
    } catch (error) {
      console.log('error1', error)
    }
  }
  if (!objetivo) {
    try {
      const newObjetivo: IObjetivoUnidade = {
        produtoId,
        unidadeId,
        metaReferencia: row.metaReferencia2,
        metaReferencia2: row.metaReferencia2,
        metaAjustada: row.metaAjustada,
        metaMinima: 0,
        trocas: row.trocas,
        trava: 'Livre',
        erros: 0,
        gravado: 0,
        ativo: 1,
        userId: ''

      }
      const t = await create(newObjetivo)
      return t
    } catch (error) {
      console.log('error2', error)
    }
  }

  throw new Error('Falha ao criar objetivo')
}

async function criarObjetivosPorAgregador (unidadeId: number): Promise<IObjetivoUnidade[]> {
  const user = await userService.getLoggedUser()

  const unidade = await unidadeService.getById(unidadeId)
  if (unidade.tipo === 'SEV') {
    return criarObjetivosPorSE(unidadeId, user)
  }

  const query: IUnidadeQueryInput = {
    vinc: unidadeId
  }
  const sevs = await unidadeService.getByQuery(query)

  let objetivos: IObjetivoUnidade[] = []

  sevs.forEach(async (sev) => {
    const objsev = await criarObjetivosPorSE(sev.id, user)
    objetivos = [...objetivos, ...objsev]
  })

  return objetivos
}

async function criarObjetivosPorSE (unidadeId: number, user: IUser): Promise<IObjetivoUnidade[]> {
  const novosObjetivos: IObjetivoUnidade[] = []
  const objetivos: ITotalizaAgregadorOutput[] = await totalizaAgregador(unidadeId)
  objetivos.forEach(async (r) => {
    const o = await createOrUpdateObjetivoAgregador(unidadeId, r, user)
    if (o) {
      novosObjetivos.push(o)
    }
  })

  return novosObjetivos
}

async function updateObjetivoLote (unidadeId: number, produtoId: number, lote: IUpdateObjetivoLoteInput[]) {
  // TODO validar os totais aqui
  const user = await userService.getLoggedUser()
  await objetivoRepository.updateObjetivoLote(lote, user)
  return user
}

export default {
  create,
  update,
  getById,
  deleteById,
  findObjetivo,
  criarObjetivosPorAgregador,
  getByQuery,
  totalizaAgregador,
  getAjustePorAgregador,
  updateObjetivoLote
}

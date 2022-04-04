import { IAjustarProduto } from '../core/interfaces/ajustar/IAjustarProduto'
import { IObjetivoUnidade } from '../core/interfaces/ObjetivoUnidade'
import IProduto from '../core/interfaces/IProduto'
import IUnidade from '../core/interfaces/IUnidade'
import IUser from '../core/interfaces/IUser'
import objetivoRepository, {
  IObjetivoQueryInput, IQueryFindObjetivos,
  IQueryTotalizaAgregadorInput, ITotalizaAgregadorOutput,
  IUpdateObjetivoLoteInput
} from '../repositories/objetivo.repository'
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

async function findObjetivos (tipo: 'AG' | 'SE', unidadeId: number, produtoId: number) {
  const unidade = await unidadeService.getById(unidadeId)
  const query: IQueryFindObjetivos = {}
  if (produtoId) {
    query.produtoId = produtoId
  }

  if (unidade.tipo === 'SR') {
    query.sr = unidadeId
    query.nivel = tipo === 'SE' ? 3 : 4
  }

  const objetivos = await objetivoRepository.findObjetivos(query)
  return objetivos
}
async function deleteById (id: number) {
  return await objetivoRepository.deleteById(id)
}

async function getByQuery (query: IObjetivoQueryInput) {
  return await objetivoRepository.getByQuery(query)
}

async function totalizaAgregador (tipo: 'AG' | 'SE', unidadeId: number, produtoId?:number) {
  const unidade: IUnidade = await unidadeService.getById(unidadeId)

  const query: IQueryTotalizaAgregadorInput = { }
  if (unidade.tipo === 'SR' && tipo === 'AG') {
    query.sr = unidadeId
    query.nivel = 4
  } else {
    query.vinc = unidadeId
  }

  if (produtoId) {
    query.produtoId = produtoId
  }
  return await objetivoRepository.totalizaAgregador(query)
}

async function getAjustePorAgregador (tipo: 'AG' | 'SE', unidadeId: number,
  produtoId: number): Promise<IAjustarProduto> {
  const unidade: IUnidade = await unidadeService.getById(unidadeId)
  const produto: IProduto = await produtoService.getById(produtoId)

  const query: IQueryTotalizaAgregadorInput = { produtoId }
  if (unidade.tipo === 'SR' && tipo === 'AG') {
    query.sr = unidadeId
    query.nivel = 4
  } else {
    query.vinc = unidadeId
  }

  if (unidade.tipo === 'SR' && tipo === 'SE') {
    query.nivel = 3
  }

  const total: ITotalizaAgregadorOutput[] = await objetivoRepository.totalizaAgregador(query)
  const t = total[0]

  if (unidade.tipo === 'SR' && tipo === 'SE') {
    query.nivel = 3
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
    metaReferencia: t.metaReferencia,
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

async function createOrUpdateObjetivoAgregador (unidadeId: number,
  row: ITotalizaAgregadorOutput, user: IUser): Promise<ObjetivoPorUnidade> {
  const produtoId = row.produtoId
  const objetivosAG = await findObjetivos('AG', unidadeId, produtoId)
  const trava = findTrava(objetivosAG.map(oa => oa.trava))
  const objetivo: ObjetivoPorUnidade | null = await findObjetivo(unidadeId, produtoId)

  if (objetivo) {
    try {
      objetivo.metaReferencia = row.metaReferencia
      objetivo.metaReferencia2 = row.metaReferencia2
      objetivo.metaAjustada = row.metaAjustada
      objetivo.userId = user.matricula
      objetivo.trava = trava
      objetivo.trocas = row.trocas
      objetivo.save()
      objetivosAG.forEach(o => { o.ativo = 1; o.save() })
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
        metaReferencia: row.metaReferencia,
        metaReferencia2: row.metaReferencia2,
        metaAjustada: row.metaAjustada,
        metaMinima: 0,
        trocas: row.trocas,
        trava: trava,
        erros: 0,
        gravado: 0,
        ativo: 1,
        userId: ''

      }
      const t = await create(newObjetivo)
      objetivosAG.forEach(o => { o.ativo = 1; o.save() })
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
  const objetivos: ITotalizaAgregadorOutput[] = await totalizaAgregador('AG', unidadeId)
  objetivos.forEach(async (r) => {
    const o = await createOrUpdateObjetivoAgregador(unidadeId, r, user)
    if (o) {
      novosObjetivos.push(o)
    }
  })

  return novosObjetivos
}

async function updateObjetivoLote (tipo: 'AG' | 'SE', unidadeId: number,
  produtoId: number, lote: IUpdateObjetivoLoteInput[]) {
  // TODO validar os totais aqui
  const unidade = await unidadeService.getById(unidadeId)
  const user = await userService.getLoggedUser()

  const atualizaReferencia = lote.map(l => !!l.metaReferencia2).reduce((p, c) => p || c, false)
  await objetivoRepository.updateObjetivoLote(lote, user)

  if (tipo === 'SE' && unidade.tipo === 'SR') {
    recalculaAgencias(unidade, produtoId, user)
  }

  if (tipo === 'AG' && unidade.tipo === 'SR') {
    recalculaSE(unidade, produtoId, user, atualizaReferencia)
  }
  return user
}

async function recalculaAgencias (unidade: IUnidade, produtoId: number, user: IUser) {
  const objetivosSEV = await findObjetivos('SE', unidade.id, produtoId)
  const objetivosAG = await findObjetivos('AG', unidade.id, produtoId)

  objetivosSEV.forEach(obje => {
    const novaMeta = obje.metaAjustada
    const totalMetaAjustada =
            objetivosAG
              .filter(obja => obja.Unidade?.se === obje.unidadeId)
              .map(obja => obja.metaAjustada)
              .reduce((p, c) => p + c, 0)

    objetivosAG
      .filter(obja => obja.Unidade?.se === obje.unidadeId)
      .forEach(obja => {
        obja.metaAjustada = novaMeta * (obja.metaAjustada / totalMetaAjustada)
        obja.metaReferencia2 = novaMeta * (obja.metaAjustada / totalMetaAjustada)
        obja.gravado = 0
        obja.userId = user.matricula
        obja.verificaErros()
        obja.save()
      })
  })
}

function findTrava (travas: string[]) {
  const lTravas = [...new Set(travas)]
  const trava = { nome: 'Livre', qtd: 0 }
  lTravas.forEach(t => {
    const qtd = travas.filter(f => f === t).length
    if (qtd >= trava.qtd) {
      trava.nome = t
      trava.qtd = qtd
    }
  })

  if (trava.qtd > 0) {
    return trava.nome
  }
  return 'Livre'
}

async function recalculaSE (unidade: IUnidade, produtoId: number, user: IUser, atualizaReferencia: boolean) {
  const objetivosSEV = await findObjetivos('SE', unidade.id, produtoId)
  const objetivosAG = await findObjetivos('AG', unidade.id, produtoId)

  const totalMetaReferencia =
    objetivosAG
      .map(obja => obja.metaReferencia)
      .reduce((p, c) => p + c, 0)

  const totalMetaReferencia2 =
    objetivosAG
      .map(obja => obja.metaReferencia)
      .reduce((p, c) => p + c, 0)

  const totalAjustada =
    objetivosAG
      .map(obja => obja.metaAjustada)
      .reduce((p, c) => p + c, 0)

  const trava = findTrava(objetivosAG.map(oa => oa.trava))
  objetivosSEV.forEach(obje => {
    const totalMetaAjustadaSEV =
        objetivosAG
          .filter(obja => obja.Unidade?.se === obje.unidadeId)
          .map(obja => obja.metaAjustada)
          .reduce((p, c) => p + c, 0)
    const totalMetaReferencia2SEV =
      objetivosAG
        .filter(obja => obja.Unidade?.se === obje.unidadeId)
        .map(obja => obja.metaReferencia2)
        .reduce((p, c) => p + c, 0)

    obje.metaAjustada = totalMetaReferencia * (totalMetaAjustadaSEV / totalMetaReferencia2)
    if (atualizaReferencia) {
      obje.metaReferencia2 = totalMetaReferencia * (totalMetaReferencia2SEV / totalAjustada)
    }

    obje.trava = trava
    obje.gravado = 1
    obje.userId = user.matricula
    obje.verificaErros()
    obje.save()
  })
}

export default {
  create,
  update,
  getById,
  deleteById,
  findObjetivo,
  findObjetivos,
  criarObjetivosPorAgregador,
  getByQuery,
  totalizaAgregador,
  getAjustePorAgregador,
  updateObjetivoLote
}

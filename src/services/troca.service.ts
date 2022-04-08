import IProduto from '../core/interfaces/IProduto'
import { ITroca } from '../core/interfaces/ITroca'
import IUnidade from '../core/interfaces/IUnidade'
import Troca from '../repositories/models/Troca'
import trocaRepository, { ITrocaQueryInput } from '../repositories/troca.repository'
import objetivoService from './objetivo.service'
import produtoService from './produto.service'
import unidadeService from './unidade.service'
import userService from './user.service'

async function create (troca: ITroca) {
  if (troca.id) {
    delete troca.id
  }

  const user = await userService.getLoggedUser()
  troca.criadoUserId = user.matricula
  troca.status = 'Criada'
  return await trocaRepository.create(troca)
}

async function cancelarTroca (id: number) {
  const user = await userService.getLoggedUser()
  const troca = await trocaRepository.getById(id)
  if (troca.status !== 'Cancelada') {
    troca.status = 'Cancelada'
    troca.homologadoUserId = user.matricula
    await troca.save()
    sincronizar(troca)
    return await trocaRepository.getById(id)
  } else {
    throw new Error(`Falha ao cancelar Troca ${id}`)
  }
}

async function homologarTroca (id: number) {
  const user = await userService.getLoggedUser()
  const troca = await trocaRepository.getById(id)
  if (troca.status === 'Criada') {
    troca.status = 'Homologada'
    troca.homologadoUserId = user.matricula
    await troca.save()
    sincronizar(troca)
    return await trocaRepository.getById(id)
  } else {
    throw new Error(`Falha ao homologar Troca ${id}`)
  }
}

async function sincronizar (troca: Troca) {
  const produtoId = troca.produtoId
  const unidade = await unidadeService.getById(troca.incrementaId)
  objetivoService.recalculaTrocasSE(unidade.sr, produtoId)
}
async function deleteById (id: number) {
  return await trocaRepository.deleteById(id)
}

async function getById (id: number) {
  return await trocaRepository.getById(id)
}

async function getTrocas (query: ITrocaQueryInput) {
  return await trocaRepository.getTrocas(query)
}

async function totalizarTrocasPorUnidade (unidadeId: number, produtoId: number): Promise<number> {
  const q: ITrocaQueryInput = {
    unidadeId,
    produtoId,
    status: 'Homologada'
  }
  const trocas = await getTrocas(q)
  const total = trocas.map(t => t.valor * (t.reduzId === unidadeId ? -1 : 1)).reduce((p, c) => p + c, 0)
  console.log(trocas, total)
  return total
}

export interface IRelatorioTrocas {
    agregador: IUnidade
    produtos: IProduto[]
    unidadesAumentar: IUnidade[]
    unidadesReduzir: IUnidade[]
    trocas: ITroca[]
}
async function getRelatorioTrocas (unidadeId: number): Promise<IRelatorioTrocas> {
  const agregador = await unidadeService.getById(unidadeId)
  const vinc = agregador.tipo === 'SR' ? agregador.id : agregador.sr
  const produtos = await produtoService.getAll()
  const filhosAgregador = await unidadeService.getByQuery({ vinc })
  const trocas = await getTrocas({})
  const relatorio = {
    agregador,
    produtos,
    unidadesAumentar: filhosAgregador,
    unidadesReduzir: filhosAgregador,
    trocas
  }
  return Promise.resolve(relatorio)
}

export default {
  create, deleteById, getById, getTrocas, getRelatorioTrocas, cancelarTroca, homologarTroca, totalizarTrocasPorUnidade
}

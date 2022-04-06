import IProduto from '../core/interfaces/IProduto'
import { ITroca } from '../core/interfaces/ITroca'
import IUnidade from '../core/interfaces/IUnidade'
import trocaRepository, { ITrocaQueryInput } from '../repositories/troca.repository'
import produtoService from './produto.service'
import unidadeService from './unidade.service'
import userService from './user.service'

async function create (troca: ITroca) {
  if (troca.id) {
    delete troca.id
  }

  const user = await userService.getLoggedUser()
  troca.userId = user.matricula
  return await trocaRepository.create(troca)
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
  create, deleteById, getById, getTrocas, getRelatorioTrocas
}

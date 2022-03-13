import { IAjustarProduto } from '../core/interfaces/ajustar/IAjustarProduto'
import { IObjetivoUnidade } from '../core/interfaces/IObjetivoUnidade'
import IProduto from '../core/interfaces/IProduto'
import IUnidade from '../core/interfaces/IUnidade'
import IUser from '../core/interfaces/IUser'
import objetivoRepository, { IObjetivoQueryInput, IQueryTotalizaAgregadorInput, ITotalizaAgregadorOutput, IUpdateObjetivoLoteInput } from '../repositories/objetivo.repository'
import produtoService from './produto.service'
import unidadeService from './unidade.service'
import userService from './user.service'

async function create (objetivo: IObjetivoUnidade) {
  const user = await userService.getLoggedUser()
  // TODO VALIDAR SE USUÁRIO PODE INSERIR OBJETIVO - CONSTRUIR AUTORIZAÇÕES
  objetivo.userId = user.matricula
  return await objetivoRepository.create(objetivo)
}

async function update (objetivo: IObjetivoUnidade) {
  const id: number = objetivo.id
  const user = await userService.getLoggedUser()
  // TODO VALIDAR SE USUÁRIO PODE INSERIR OBJETIVO - CONSTRUIR AUTORIZAÇÕES
  objetivo.userId = user.matricula
  return await objetivoRepository.update(id, objetivo)
}

async function getById (id: number) {
  return await objetivoRepository.getById(id)
}

async function deleteById (id: number) {
  return await objetivoRepository.deleteById(id)
}

async function getByQuery (query: IObjetivoQueryInput) {
  return await objetivoRepository.getByQuery(query)
}

async function totalizaAgregador (query: IQueryTotalizaAgregadorInput) {
  return await objetivoRepository.totalizaAgregador(query)
}

async function getAjustePorAgregador (unidadeId: number, produtoId: number): Promise<IAjustarProduto> {
  const unidade: IUnidade = await unidadeService.getById(unidadeId)
  const produto: IProduto = await produtoService.getById(produtoId)

  const query: IQueryTotalizaAgregadorInput = { produtoId, vinc: unidadeId }

  const total: ITotalizaAgregadorOutput[] = await objetivoRepository.totalizaAgregador(query)
  const t = total[0]

  const rows: IObjetivoUnidade[] = await getByQuery({ produtoId: produtoId, vinc: unidadeId })
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
    erros: 0,
    rows,
    userId: userId.matricula
  }

  return ajuste
}

async function updateObjetivoLote (unidadeId: number, produtoId: number, lote: IUpdateObjetivoLoteInput[]) {
  // TODO validar os totais aqui
  return await objetivoRepository.updateObjetivoLote(lote)
}
export default {
  create,
  update,
  getById,
  deleteById,
  getByQuery,
  totalizaAgregador,
  getAjustePorAgregador,
  updateObjetivoLote

}

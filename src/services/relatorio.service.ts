import IProduto from '../core/interfaces/IProduto'
import IUnidade from '../core/interfaces/IUnidade'
import objetivoRepository, { IQueryTotalizaAgregadorInput, ITotalizaAgregadorOutput } from '../repositories/objetivo.repository'
import produtoService from './produto.service'
import unidadeService from './unidade.service'

export interface IRelatorioPorAgregador {
    agregador: IUnidade
    produtos: IProduto[]
    unidades: IUnidade[]
    rows: ITotalizaAgregadorOutput[]
    rowsVinculadas?: ITotalizaAgregadorOutput[]

}

async function geraRelatorioPorAgregadorProduto (vinc: number, produtoId?: number): Promise<IRelatorioPorAgregador> {
  const agregador = await unidadeService.getById(vinc)
  let produtos: IProduto[] = await produtoService.getAll()

  if (produtoId) {
    produtos = produtos.filter(r => r.id === produtoId)
  }

  let unidades: IUnidade[] = await unidadeService.getByQuery({ vinc: agregador.sr })
  let rows: ITotalizaAgregadorOutput[] = []
  if (agregador.tipo === 'SEV') {
    unidades = unidades.filter(r => r.se === agregador.id)

    const query: IQueryTotalizaAgregadorInput = { vinc: agregador.se }
    if (produtoId) {
      query.produtoId = produtoId
    }
    rows = await objetivoRepository.totalizaAgregador(query)
  } else {
    const querysr: IQueryTotalizaAgregadorInput = { sr: agregador.sr, nivel: 4 }
    const queryse: IQueryTotalizaAgregadorInput = { agregador: agregador.sr, nivel: 4 }
    if (produtoId) {
      querysr.produtoId = produtoId
      queryse.produtoId = produtoId
    }
    const rowssr = await objetivoRepository.totalizaAgregador(querysr)
    const rowsse = await objetivoRepository.totalizaAgregador(queryse)
    rows = [...rowssr, ...rowsse]
  }

  unidades = [agregador, ...unidades]

  const relatorio: IRelatorioPorAgregador = {
    agregador,
    produtos,
    unidades,
    rows
  }

  return Promise.resolve(relatorio)
}

export default {
  geraRelatorioPorAgregadorProduto
}

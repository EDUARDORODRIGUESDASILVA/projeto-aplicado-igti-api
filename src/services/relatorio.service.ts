import IProduto from '../core/interfaces/IProduto'
import IUnidade from '../core/interfaces/IUnidade'
import objetivoRepository, { ITotalizaAgregadorOutput } from '../repositories/objetivo.repository'
import produtoService from './produto.service'
import unidadeService from './unidade.service'

interface IRelatorioPorAgregador {
    agregador: IUnidade
    produtos: IProduto[]
    unidades: IUnidade[]
    rows: ITotalizaAgregadorOutput[]
    rowsVinculadas?: ITotalizaAgregadorOutput[]

}

async function geraRelatorioPorAgregadorProduto (vinc: number): Promise<IRelatorioPorAgregador> {
  const agregador = await unidadeService.getById(vinc)
  const produtos: IProduto[] = await produtoService.getAll()

  let unidades: IUnidade[] = await unidadeService.getByQuery({ vinc: agregador.sr })
  let rows: ITotalizaAgregadorOutput[] = []
  if (agregador.tipo === 'SEV') {
    unidades = unidades.filter(r => r.se === agregador.id)
    rows = await objetivoRepository.totalizaAgregador({ vinc: agregador.se })
  } else {
    const rowssr = await objetivoRepository.totalizaAgregador({ sr: agregador.sr })
    const rowsse = await objetivoRepository.totalizaAgregador({ agregador: agregador.sr })
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

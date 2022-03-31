import { IObjetivoUnidade } from '../ObjetivoUnidade'
import IProduto from '../IProduto'
import IUnidade from '../IUnidade'

export interface IAjustarProduto extends IObjetivoUnidade {
  unidade: IUnidade
  produto: IProduto
  rows: IObjetivoUnidade[]
}

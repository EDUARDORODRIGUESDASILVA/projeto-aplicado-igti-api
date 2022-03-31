import { IObjetivoUnidade } from '../ObjetivoUnidade'
import IProduto from '../IProduto'
import IUnidade from '../IUnidade'

export interface IRowAjustar extends IObjetivoUnidade {
  produto: IProduto
  iUnidade: IUnidade
}

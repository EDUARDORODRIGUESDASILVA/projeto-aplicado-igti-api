/* eslint-disable no-unused-vars */
export enum SituacaoAivo {
  Fechado = 0,
  Ativo = 1,
  ApenasSR = 2,
  ApenasSEV = 3
}

export interface IObjetivoUnidade {
  id: number,
  produtoId: number
  unidadeId: number
  metaReferencia: number
  metaReferencia2: number
  metaAjustada: number
  metaMinima: number
  trocas: number
  trava: string
  erros: number
  gravado: number
  qtdlinhas?: number
  ativo: SituacaoAivo
  userId: string
}

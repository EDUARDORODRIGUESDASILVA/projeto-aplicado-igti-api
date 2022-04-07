import IUser from './IUser'

export type TrocaStatus = 'Criada' | 'Homologada' | 'Cancelada'
export interface ITroca {
    id?: number
    incrementaId: number
    reduzId: number
    produtoId: number
    criadoUserId: string
    valor: number
    status: TrocaStatus
    homologadoUserId: string
    criador?: IUser
    homologador?: IUser | null
}

export default interface IUser {
  matricula: string
  nome: string
  funcao: string
  unidadeId: number
  autorizadoId: number
  admin: boolean
  leitura: boolean
  gravacao: boolean
  prazo: Date
}

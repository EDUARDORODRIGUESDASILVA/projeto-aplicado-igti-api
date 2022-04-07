import { DataTypes, Model, Optional } from 'sequelize'
import { ITroca, TrocaStatus } from '../../core/interfaces/ITroca'
import sequelizeConnection from '../db.config'
import Produto from './Produto'
import Unidade from './Unidade'
import Usuario from './Usuario'

interface TrocaAttributes extends ITroca {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface TrocaInput extends Optional<TrocaAttributes, 'id'> { }
// export interface UsuarioOuput extends Required<UsuarioAttributes> { }

class Troca extends Model<TrocaInput, TrocaAttributes> implements TrocaAttributes {
  id!: number
  incrementaId!: number
  reduzId!: number
  produtoId!: number
  valor!: number
  status!: TrocaStatus
  criadoUserId!: string
  homologadoUserId!: string
  // timestamps!
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date
}

Troca.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },

  produtoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  incrementaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reduzId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  criadoUserId: {
    type: DataTypes.STRING,
    allowNull: false
  },

  homologadoUserId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  // underscored: true
  paranoid: true
})
Troca.belongsTo(Unidade, { foreignKey: 'incrementaId', as: 'incrementa', targetKey: 'id' })
Troca.belongsTo(Unidade, { foreignKey: 'reduzId', as: 'reduz', targetKey: 'id' })
Troca.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' })
Troca.belongsTo(Usuario, { foreignKey: 'criadoUserId', as: 'criador', targetKey: 'matricula' })
Troca.belongsTo(Usuario, { foreignKey: 'homologadoUserId', as: 'homologador', targetKey: 'matricula' })

export default Troca

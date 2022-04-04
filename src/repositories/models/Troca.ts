import { DataTypes, Model, Optional } from 'sequelize'
import { ITroca } from '../../core/interfaces/ITroca'
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
    userId!: string
    valor!: number
    status!: 'OK' | 'Cancelada'
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

  userId: {
    type: DataTypes.STRING,
    allowNull: false
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
Troca.belongsTo(Unidade, { foreignKey: 'incrementaId', targetKey: 'id' })
Troca.belongsTo(Unidade, { foreignKey: 'reduzId', targetKey: 'id' })
Troca.belongsTo(Produto, { foreignKey: 'produtoId' })
Troca.belongsTo(Usuario, { foreignKey: 'userId', targetKey: 'matricula' })

export default Troca

import { DataTypes, Model } from 'sequelize'
import IUser from '../../core/interfaces/IUser'
import sequelizeConnection from '../db.config'
import Unidade from './Unidade'

interface UsuarioAttributes extends IUser {
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
// export interface UsuarioInput extends Optional<ProdutoAttributes, 'id'> { }
// export interface UsuarioOuput extends Required<UsuarioAttributes> { }

class Usuario extends Model<UsuarioAttributes, UsuarioAttributes> implements UsuarioAttributes {
    public matricula!: string;
    public nome!: string;
    public funcao!: string;
    public unidadeId!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Usuario.init({
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  funcao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  underscored: true,
  paranoid: true
})
Usuario.belongsTo(Unidade, { foreignKey: 'unidade_id' })
export default Usuario

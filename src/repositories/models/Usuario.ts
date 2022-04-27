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

   // perfil
   public autorizadoId!: number;
   public admin!: boolean;
   public leitura!: boolean;
   public gravacao!: boolean;
   public prazo!: Date;

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
    unique: false
  },
  funcao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  autorizadoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  leitura: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  gravacao: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  prazo: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  // underscored: true
  paranoid: true
})
Usuario.belongsTo(Unidade, { foreignKey: 'unidadeId' })
Usuario.belongsTo(Unidade, { foreignKey: 'autorizadoId', as: 'autorizacao', targetKey: 'id' })

export default Usuario

import { DataTypes, Model } from 'sequelize'
import IUnidade from '../../core/interfaces/IUnidade'
import sequelizeConnection from '../db.config'

interface UnidadeAttributes extends IUnidade {
    icOrdem?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
// export interface ProdutoInput extends Optional<UnidadeAttributes, 'id' > { }
// export interface ProdutoOuput extends Required<UnidadeAttributes> { }

class Unidade extends Model<UnidadeAttributes, UnidadeAttributes> implements UnidadeAttributes {
    id!: number;
    nome!: string;
    tipo!: string;
    porte!: number;
    cluster!: string;
    nivel!: number;
    se!: number;
    sr!: number;
    vinc!: number;
    rede!: string;
    icOrdem?: number | undefined;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Unidade.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  porte: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cluster: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  vinc: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  se: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  sr: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  rede: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  // underscored: true,
  sequelize: sequelizeConnection
  // paranoid: true
})
Unidade.belongsTo(Unidade, { foreignKey: 'vinc' })
Unidade.belongsTo(Unidade, { foreignKey: 'se' })

export default Unidade

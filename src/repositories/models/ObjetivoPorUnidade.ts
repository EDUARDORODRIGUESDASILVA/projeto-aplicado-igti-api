import { DataTypes, Model, Optional } from 'sequelize'
import IProduto from '../../core/interfaces/IProduto'
import sequelizeConnection from '../db.config'

interface ProdutoAttributes extends IProduto {
    icOrdem?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface ProdutoInput extends Optional<ProdutoAttributes, 'id' > { }
export interface ProdutoOuput extends Required<ProdutoAttributes> { }

class Produto extends Model<ProdutoAttributes, ProdutoInput> implements ProdutoAttributes {
    public id!: number;
    public codsidem!: string;
    public nome!: string;
    public bloco!: string;
    public conquiste!: string;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Produto.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  codsidem: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bloco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conquiste: {
    type: DataTypes.STRING,
    allowNull: false
  },

  icOrdem: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: true
})

export default Produto

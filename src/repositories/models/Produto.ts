import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from '../db.config'

interface ProdutoAttributes {
    produtoId: number;
    codigo: string;
    nome: string;
    ativo: boolean;
    icOrdem: number;
    descricao?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface ProdutoInput extends Optional<ProdutoAttributes, 'produtoId' | 'descricao'> { }
export interface ProdutoOuput extends Required<ProdutoAttributes> { }

class Produto extends Model<ProdutoAttributes, ProdutoInput> implements ProdutoAttributes {
    public produtoId!: number;
    public nome!: string;
    public codigo!: string;
    public ativo!: boolean;
    public descricao!: string | undefined;
    public icOrdem!: number;
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Produto.init({
  produtoId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
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

import { DataTypes, Model, Optional } from 'sequelize'
import { IObjetivoUnidade } from '../../core/interfaces/IObjetivoUnidade'
import sequelizeConnection from '../db.config'
import Produto from './Produto'
import Unidade from './Unidade'
import Usuario from './Usuario'

interface ObjetivoPorUnidadeAttributes extends IObjetivoUnidade {
  icOrdem?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface ObjetivoPorUnidadeInput extends Optional<ObjetivoPorUnidadeAttributes, 'id'> { }
// export interface ProdutoOuput extends Required<ProdutoAttributes> { }

class ObjetivoPorUnidade extends Model<ObjetivoPorUnidadeAttributes, ObjetivoPorUnidadeInput> implements ObjetivoPorUnidadeAttributes {
  id!: number;
  produtoId!: number;
  unidadeId!: number;
  metaReferencia!: number;
  metaReferencia2!: number;
  metaAjustada!: number;
  metaMinima!: number;
  trocas!: number;
  trava!: string;
  erros!: number;
  userId!: string;
  gravado!: number
  ativo!: number
  // timestamps!
  icOrdem?: number | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

ObjetivoPorUnidade.init({
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
  unidadeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  metaReferencia: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  metaReferencia2: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  metaAjustada: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  metaMinima: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  trocas: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  trava: {
    type: DataTypes.STRING,
    allowNull: false
  },
  erros: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  gravado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ativo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  sequelize: sequelizeConnection
  // underscored: true
  // paranoid: true
})

// TODO FIX RELATIONS ON OBJETIVO POR UNIDADE
ObjetivoPorUnidade.belongsTo(Unidade, { foreignKey: 'unidadeId' })
// Venda.hasOne(Cliente)

ObjetivoPorUnidade.belongsTo(Produto, { foreignKey: 'produtoId' })
ObjetivoPorUnidade.belongsTo(Usuario, { foreignKey: 'userId' })
// Venda.hasOne(Livro)

export default ObjetivoPorUnidade

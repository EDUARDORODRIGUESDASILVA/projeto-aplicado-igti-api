import { DataTypes, Model, Optional } from 'sequelize'
import { IObjetivoUnidade } from '../../core/interfaces/ObjetivoUnidade'
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
  qtdlinhas!: number
  // timestamps!
  icOrdem?: number | undefined;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public verificaErros () {
    const erroPct = this.verificaTravaPercentual()
    const erroPiso = this.verificaPiso()
    this.erros = (erroPct + erroPiso) > 0 ? 1 : 0
  }

  private verificaTravaPercentual (): 0 | 1 {
    if (this.trava === 'Livre') {
      return 0
    }

    let travaPct: number = 0

    if (typeof (this.trava) === 'string' && this.trava.endsWith('%')) {
      const strava = this.trava.replace('%', '')
      travaPct = parseFloat(strava) / 100
    } else {
      return 1
    }

    if (this.metaAjustada === 0 && this.metaReferencia === 0) {
      return 0
    }

    if (this.metaAjustada === this.metaReferencia) {
      return 0
    }

    const sign = (this.metaReferencia ? this.metaReferencia / Math.abs(this.metaReferencia) : 0)
    const metaMaxima = this.metaReferencia * (1 + (sign * travaPct))
    const metaMinima = this.metaReferencia * (1 - (sign * travaPct))

    if (this.metaAjustada > metaMaxima) {
      return 1
    }

    if (this.metaAjustada < metaMinima) {
      return 1
    }
    return 0
  }

  private verificaPiso (): 0 | 1 {
    if (this.metaAjustada === 0 && this.metaReferencia === 0) {
      return 0
    }

    if (Math.trunc(this.metaAjustada * 100) / 100 <
      Math.trunc(this.metaMinima * 100) / 100 &&
      this.metaMinima !== 0) {
      return 1
    }
    return 0
  }
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

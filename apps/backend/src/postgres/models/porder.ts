import { sequelize } from '@/postgres/config/client'
import { DataTypes, type Model } from 'sequelize'

export interface POrderAttributes {
  id?: string
  business_id: string
  user_id: string
  status: number
  total: number
  subtotal: number
  tax: number
  products: string
}

export interface POrderInstance extends Model<POrderAttributes>, POrderAttributes {}

export const pOrderClient = sequelize.define<POrderInstance, POrderAttributes>(
  'purchase_order',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    business_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    tax: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    products: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'orden_compra',
    timestamps: false,
  }
)

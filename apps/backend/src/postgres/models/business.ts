import { sequelize } from '@/postgres/config/client'
import { DataTypes, type Model } from 'sequelize'

export interface BusinessAttributes {
	id?: string
	name: string
  is_deleted?: boolean
}

export interface BusinessInstance extends Model<BusinessAttributes>, BusinessAttributes {}

export const businessClient = sequelize.define<BusinessInstance, BusinessAttributes>(
	'business',
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
	},
	{
		tableName: 'negocios',
		timestamps: false,
	}
)

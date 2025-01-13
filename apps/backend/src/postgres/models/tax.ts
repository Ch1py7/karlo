import { sequelize } from '@/postgres/config/client'
import { DataTypes, type Model } from 'sequelize'

export interface TaxAttributes {
	tax: number
}

export interface TaxInstance extends Model<TaxAttributes>, TaxAttributes {}

export const taxClient = sequelize.define<TaxInstance, TaxAttributes>(
	'tax',
	{
		tax: {
			type: DataTypes.INTEGER,
		},
	},
	{
		tableName: 'iva',
		timestamps: false,
	}
)

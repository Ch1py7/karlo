import { sequelize } from '@/postgres/config/client'
import { DataTypes, type Model } from 'sequelize'

export interface ProductAttributes {
	id?: string
	business_id: string
	name: string
	stock: number
	price: number
	is_deleted?: boolean
}

export interface ProductInstance extends Model<ProductAttributes>, ProductAttributes {}

export const productClient = sequelize.define<ProductInstance, ProductAttributes>(
	'products',
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
			unique: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		business_id: {
			type: DataTypes.UUIDV4,
			allowNull: false,
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		tableName: 'productos',
		timestamps: false,
	}
)

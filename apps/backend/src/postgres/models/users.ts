import { sequelize } from '@/postgres/config/client'
import { DataTypes, type Model } from 'sequelize'

export interface UserAttributes {
	id?: string
	email: string
	is_validated?: boolean
	name: string
	password: string
	role_id: number
	validation_code?: string | null
	is_deleted?: boolean
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export const userClient = sequelize.define<UserInstance, UserAttributes>(
	'user',
	{
		id: {
			type: DataTypes.UUIDV4,
			primaryKey: true,
      unique: true
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		role_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		is_validated: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		validation_code: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		is_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		tableName: 'usuarios',
		timestamps: false,
	}
)

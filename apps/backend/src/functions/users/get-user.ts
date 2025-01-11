import { userClient } from '@/postgres/models/users'
import { Op, Sequelize } from 'sequelize'

export const get = async (search?: string) => {
	try {
		const whereClause = search
			? {
					[Op.or]: [
						{ name: { [Op.like]: `%${search}%` } },
						{ email: { [Op.like]: `%${search}%` } },
						Sequelize.where(Sequelize.cast(Sequelize.col('id'), 'text'), {
							[Op.like]: `%${search}%`,
						}),
					],
				}
			: {}

		const users = await userClient.findAll({
			where: {
				...whereClause,
				[Op.and]: [{ is_deleted: false }],
			},
		})

		return users
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

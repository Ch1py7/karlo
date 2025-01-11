import { businessClient } from '@/postgres/models/business'
import { Op, Sequelize } from 'sequelize'

export const get = async (search?: string) => {
	try {
		const whereClause = search
			? {
					[Op.or]: [
						{ name: { [Op.like]: `%${search}%` } },
						Sequelize.where(Sequelize.cast(Sequelize.col('id'), 'text'), {
							[Op.like]: `%${search}%`,
						}),
					],
				}
			: {}

		const business = await businessClient.findAll({
			where: { ...whereClause, [Op.and]: [{ is_deleted: false }] },
		})

		return business
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

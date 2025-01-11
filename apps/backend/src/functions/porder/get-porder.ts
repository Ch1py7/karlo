import { pOrderClient } from '@/postgres/models/porder'
import { Op, Sequelize } from 'sequelize'

interface POrder {
	user_id: string
	search?: string
}

export const get = async ({ user_id, search }: POrder) => {
	try {
		const whereClause = search
			? {
					[Op.or]: [
						{ status: { [Op.like]: `%${search}%` } },
						{ total: { [Op.like]: `%${search}%` } },
						Sequelize.where(Sequelize.cast(Sequelize.col('id'), 'text'), {
							[Op.like]: `%${search}%`,
						}),
					],
				}
			: {}

		const porder = await pOrderClient.findAll({
			where: { ...whereClause, [Op.and]: [{ id: { [Op.eq]: user_id } }] },
		})

		return porder
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

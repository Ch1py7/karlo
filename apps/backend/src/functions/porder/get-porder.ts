import { pOrderClient } from '@/postgres/models/porder'
import { Op, Sequelize } from 'sequelize'
import { validateStatus } from '../utils/validators'

interface POrder {
	id: string
	role_id: number
	search?: string
}

export const get = async ({ id, role_id, search }: POrder) => {
	try {
		const status = search ? validateStatus(search) : false

		const whereClause = search
			? {
					[Op.or]: [
						{ status: { [Op.eq]: status } },
						Sequelize.where(Sequelize.cast(Sequelize.col('total'), 'text'), {
							[Op.like]: `%${search}%`,
						}),
						Sequelize.where(Sequelize.cast(Sequelize.col('id'), 'text'), {
							[Op.like]: `%${search}%`,
						}),
					],
				}
			: {}

		const isBusinessClause =
			role_id === 1
				? {
						[Op.and]: [{ business_id: { [Op.eq]: id } }],
					}
				: {
						[Op.and]: [{ user_id: { [Op.eq]: id } }],
					}

		const porder = await pOrderClient.findAll({
			where: { ...whereClause, ...isBusinessClause },
		})

		return porder
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

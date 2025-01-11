import { productClient } from '@/postgres/models/products'
import { Op, Sequelize } from 'sequelize'

interface Product {
	business_id: string
	search?: string
}

export const get = async ({ business_id, search }: Product) => {
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

		const products = await productClient.findAll({
			where: {
				...whereClause,
				[Op.and]: [
					{ is_deleted: false },
					{ stock: { [Op.gt]: 0 } },
					{ business_id: { [Op.eq]: business_id } },
				],
			},
		})

		return products
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

import type { POrderAttributes } from '@/postgres/models/porder'
import { pOrderClient } from '@/postgres/models/porder'
import { productClient } from '@/postgres/models/products'
import { Sequelize } from 'sequelize'

export const update = async ({ status, id }: Pick<POrderAttributes, 'status' | 'id'>) => {
	try {
		if (status === 4) {
			const order = await pOrderClient.findOne({ where: { id } })
			if (!order) {
				throw new Error(`Order with ID ${id} does not exist`)
			}
			const productsInOrder: { id: string; quantity: number }[] = JSON.parse(order.products)
			for (const product of productsInOrder) {
				await productClient.update(
					{ stock: Sequelize.literal(`stock + ${product.quantity}`) },
					{ where: { id: product.id } }
				)
			}
		}

		await pOrderClient.update({ status }, { where: { id } })
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

import type { POrderAttributes } from '@/postgres/models/porder'
import { pOrderClient } from '@/postgres/models/porder'
import { productClient } from '@/postgres/models/products'
import { Sequelize } from 'sequelize'

export const create = async (porderProps: POrderAttributes) => {
	try {
		const productsInOrder: { id: string; quantity: number }[] = JSON.parse(porderProps.products)
		for (const product of productsInOrder) {
			const productInDB = await productClient.findOne({ where: { id: product.id } })
			if (!productInDB) {
				throw new Error('Product does not exist')
			}
			if (productInDB.stock < product.quantity) {
				throw new Error(`Not enough stock for product "${productInDB.name}"`)
			}
		}

		const porder = await pOrderClient.create({ ...porderProps })

		if (!porder) {
			throw new Error('Order was not created')
		}

		for (const product of productsInOrder) {
			await productClient.update(
				{ stock: Sequelize.literal(`stock - ${product.quantity}`) },
				{ where: { id: product.id } }
			)
		}

		return { porder }
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

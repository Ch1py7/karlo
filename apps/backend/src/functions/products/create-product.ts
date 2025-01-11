import type { ProductAttributes } from '@/postgres/models/products'
import { productClient } from '@/postgres/models/products'

export const create = async (productProps: ProductAttributes) => {
	try {
		productProps.is_deleted = false
		const product = await productClient.create({ ...productProps })

		if (!product) {
			throw new Error('Product was not created')
		}

		return { id: product.id, name: product.name }
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

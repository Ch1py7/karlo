import type { ProductAttributes } from '@/postgres/models/products'
import { productClient } from '@/postgres/models/products'

export const update = async ({
	name,
	id,
	price,
	stock,
}: Pick<ProductAttributes, 'name' | 'id' | 'price' | 'stock'>) => {
	try {
		await productClient.update({ name, price, stock }, { where: { id } })
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

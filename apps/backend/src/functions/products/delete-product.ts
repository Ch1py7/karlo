import { productClient } from '@/postgres/models/products'

export const cancel = async (id: string) => {
	try {
		const product = await productClient.findOne({
			where: { id },
		})

		if (!product) {
			throw new Error('Product not found')
		}

		product.is_deleted = true

		await product.save()
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

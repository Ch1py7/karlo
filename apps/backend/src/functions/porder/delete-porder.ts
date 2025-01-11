import { pOrderClient } from '@/postgres/models/porder'

export const cancel = async (id: string) => {
	try {
		const porder = await pOrderClient.destroy({
			where: { id },
		})

		if (!porder) {
			throw new Error('Order not found')
		}
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

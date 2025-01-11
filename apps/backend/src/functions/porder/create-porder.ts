import type { POrderAttributes } from '@/postgres/models/porder'
import { pOrderClient } from '@/postgres/models/porder'

export const create = async (porderProps: POrderAttributes) => {
	try {
		const porder = await pOrderClient.create({ ...porderProps })

		if (!porder) {
			throw new Error('Order was not created')
		}

		return { porder }
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

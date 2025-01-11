import type { POrderAttributes } from '@/postgres/models/porder'
import { pOrderClient } from '@/postgres/models/porder'

export const update = async ({ status, id }: Pick<POrderAttributes, 'status' | 'id'>) => {
	try {
		await pOrderClient.update({ status }, { where: { id } })
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

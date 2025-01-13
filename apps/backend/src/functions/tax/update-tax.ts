import type { TaxAttributes } from '@/postgres/models/tax'
import { taxClient } from '@/postgres/models/tax'

export const update = async ({ tax }: TaxAttributes) => {
	try {
		await taxClient.update({ tax }, { where: {} })
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

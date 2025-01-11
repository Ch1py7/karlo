import type { BusinessAttributes } from '@/postgres/models/business'
import { businessClient } from '@/postgres/models/business'

export const update = async ({ name, id }: Pick<BusinessAttributes, 'name' | 'id'>) => {
	try {
		await businessClient.update({ name }, { where: { id } })
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

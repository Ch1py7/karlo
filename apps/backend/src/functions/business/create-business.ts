import type { BusinessAttributes } from '@/postgres/models/business'
import { businessClient } from '@/postgres/models/business'

export const create = async (businessProps: BusinessAttributes) => {
	try {
		businessProps.is_deleted = false
		const business = await businessClient.create({ ...businessProps })

		if (!business) {
			throw new Error('Business was not created')
		}

		return { id: business.id, name: business.name }
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

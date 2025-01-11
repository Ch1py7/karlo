import { businessClient } from '@/postgres/models/business'

export const cancel = async (id: string) => {
	try {
		const business = await businessClient.findOne({
			where: { id },
		})

		if (!business) {
			throw new Error('Business not found')
		}

		business.is_deleted = true

		await business.save()
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

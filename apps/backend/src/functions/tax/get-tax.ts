import { taxClient } from '@/postgres/models/tax'

export const get = async () => {
	try {
		const tax = await taxClient.findAll({ where: {} })
		return tax[0].tax
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

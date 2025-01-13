import { userClient } from '@/postgres/models/users'
import { signJwt } from '../service/jwt'

export const token = async (userId: string) => {
	try {
		const user = await userClient.findOne({
			where: { id: userId },
		})

		if (!user) {
			throw new Error('Something went wrong...')
		}

		const { id, role_id, email, name, is_validated } = user

		if (!is_validated) {
			throw new Error('Please validate your account before logging in')
		}

		const token = signJwt({ sub: id, role_id, is_validated, name, email })
		return { token }
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

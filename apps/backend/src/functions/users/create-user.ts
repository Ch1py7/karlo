import type { UserAttributes } from '@/postgres/models/users'
import { userClient } from '@/postgres/models/users'
import crypto from 'node:crypto'

export const create = async (userProps: UserAttributes) => {
	try {
		userProps.is_deleted = false
		const validation_code = crypto.randomBytes(3).toString('hex')
		const user = await userClient.create({ ...userProps, validation_code })

		if (!user) {
			throw new Error('User was not created')
		}

		return { email: user.email, validation_code }
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

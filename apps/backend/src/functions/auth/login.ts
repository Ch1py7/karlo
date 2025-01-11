import { userClient } from '@/postgres/models/users'
import { signJwt } from '../service/jwt'

interface User {
	email: string
	password: string
}

export const login = async (userKeys: User) => {
	try {
		const user = await userClient.findOne({
			where: { email: userKeys.email, password: userKeys.password },
		})

		if (!user) {
			throw new Error('Email or password is incorrect')
		}

		const { id, role_id, email, name, is_validated } = user

    if (!is_validated) {
      throw new Error('Please validate your account before logging in')
    }

		const token = signJwt({ sub: id, role_id, is_validated })
		return { email, name, token, role_id }
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

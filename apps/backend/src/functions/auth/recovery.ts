import { userClient } from '@/postgres/models/users'

interface recoverData {
	email: string
	password: string
}

export const recovery = async (recoverData: recoverData) => {
	try {
		const user = await userClient.findOne({
			where: { email: recoverData.email, password: recoverData.password },
		})

		if (!user) {
			throw new Error('Invalid email or password')
		}

    return user.validation_code
	} catch (e) {
		throw new Error((e as Error).message)
	}
}
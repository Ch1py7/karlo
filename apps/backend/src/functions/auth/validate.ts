import { userClient } from '@/postgres/models/users'

interface validateUser {
	email: string
	validation_code: string
}

export const validate = async (validation: validateUser) => {
	try {
		const user = await userClient.findOne({
			where: { email: validation.email, validation_code: validation.validation_code },
		})

		if (!user) {
			throw new Error('Invalid email or validation code')
		}

		user.validation_code = null
		user.is_validated = true

		await user.save()
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

import { userClient } from '@/postgres/models/users'

export const cancel = async (id: string) => {
	try {
		const user = await userClient.findOne({
			where: { id },
		})

		if (!user) {
			throw new Error('User not found')
		}

		user.is_deleted = true

		await user.save()
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

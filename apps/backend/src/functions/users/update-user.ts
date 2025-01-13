import type { UserAttributes } from '@/postgres/models/users'
import { userClient } from '@/postgres/models/users'

export const update = async ({
	id,
	name,
}: Pick<UserAttributes, 'id' | 'name'>) => {
	try {
		await userClient.update({ name }, { where: { id } })
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

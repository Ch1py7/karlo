import type { UserAttributes } from '@/postgres/models/users'
import { userClient } from '@/postgres/models/users'

export const update = async ({
	id,
	name,
	role_id,
}: Pick<UserAttributes, 'id' | 'name' | 'role_id'>) => {
	try {
		await userClient.update({ name, role_id }, { where: { id } })
	} catch (e) {
		throw new Error((e as Error).message)
	}
}

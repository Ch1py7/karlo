export namespace UsersService {
	export const login = () => {
		return 'http://localhost:473/api/auth/login'
	}

	export const register = () => {
		return 'http://localhost:473/api/auth/register'
	}

	export const updateUser = () => {
		return 'http://localhost:473/api/users/update'
	}

	export const getUsers = (search?: string) => {
		return `http://localhost:473/api/users${search ? `?search=${search}` : ''}`
	}

	export const validateUser = () => {
		return 'http://localhost:473/api/auth/validate'
	}

	export const getToken = ({ email, password }: { email: string; password: string }) => {
		return `http://localhost:473/api/auth/recover?password=${password}&email=${email}`
	}
}

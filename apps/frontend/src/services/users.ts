export namespace UsersService {
	export const login = () => {
		return 'https://karlo.onrender.com/api/auth/login'
	}

	export const register = () => {
		return 'https://karlo.onrender.com/api/auth/register'
	}

	export const updateUser = () => {
		return 'https://karlo.onrender.com/api/users/update'
	}

	export const getUsers = (search?: string) => {
		return `https://karlo.onrender.com/api/users${search ? `?search=${search}` : ''}`
	}

	export const validateUser = () => {
		return 'https://karlo.onrender.com/api/auth/validate'
	}

	export const getToken = (id: string) => {
		return `https://karlo.onrender.com/api/users/token${id ? `?id=${id}` : ''}`
	}

  export const getCode = ({ email, password }: { email: string; password: string }) => {
			return `https://karlo.onrender.com/api/auth/recover?password=${password}&email=${email}`
		}
}

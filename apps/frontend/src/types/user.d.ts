interface User {
	id: string
	email: string
	name: string
	token: string
	role_id: number
	password: string
	validation_code: string
}

type SendLogin = Pick<User, 'email' | 'password'>
type SendRegister = Omit<User, 'token' | 'validation_code'>
type GetLogin = Pick<User, 'token'>
type GetUser = Omit<User, 'token' | 'password'>
type GetRegister = Pick<User, 'email' | 'validation_code'>
type GetRecoverCode = Pick<User, 'email', 'password'>

interface RecoverCode extends GetRegister {
	password?: string
}

interface Login {
	login: SendLogin
	setLogin: React.Dispatch<React.SetStateAction<SendLogin>>
}

interface Register {
	register: SendRegister
	setRegister: React.Dispatch<React.SetStateAction<SendRegister>>
}

interface Token {
	id: string
	role_id: number
	is_validated: boolean
	name: string
	email: string
}

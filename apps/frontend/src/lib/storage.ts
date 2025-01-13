const validationCode = 'validation_code'
const token = 'token'

export const removeSession = () => {
	localStorage.removeItem(token)
}

export const getVerificationCode = (): string => {
	const token = localStorage.getItem('token') ?? ''
	return token
}

export const setValidationCode = (code: string) => {
	localStorage.setItem(validationCode, code)
}

export const getValidationCode = (): string => {
	const code = localStorage.getItem(validationCode) ?? ''
	return code
}

export const removeValidationCode = () => {
	localStorage.removeItem(validationCode)
}

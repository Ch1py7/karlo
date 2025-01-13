import { setValidationCode } from '@/lib/storage'
import { validateEmail } from '@/lib/validators'
import { postRequest } from '@/services/requests'
import { UsersService } from '@/services/users'
import { AxiosError } from 'axios'
import { AlertCircle, Building2, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const resetInputs = {
	id: crypto.randomUUID(),
	email: '',
	name: '',
	token: '',
	password: '',
}

export const Register: React.FC<Register> = ({ register, setRegister }): React.ReactNode => {
	const [isBusinessRegister, setIsBusinessRegister] = useState(false)
	const [error, setError] = useState({ error: false, msg: '' })
	const [confPass, setConfPass] = useState('')

	const navigate = useNavigate()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (validateEmail(register.email)) {
			setError({
				error: true,
				msg: 'Invalid email format. Please enter a valid email address (e.g., user@example.com).',
			})
			return
		}
		if (register.password.length < 8) {
			setError({
				error: true,
				msg: 'Password too short. It must be at least 8 characters long.',
			})
			return
		}
		if (register.name.length < 3) {
			setError({
				error: true,
				msg: 'Name too short. It must be at least 3 characters long.',
			})
			return
		}
		if (register.password !== confPass) {
			setError({
				error: true,
				msg: 'Passwords do not match. Please ensure both fields are identical.',
			})
			return
		}

		try {
			const { data, status } = await postRequest<GetRegister>(UsersService.register(), register)

			if (status === 201) {
				setValidationCode(data.validation_code)

				navigate('/auth/validation')
			}
		} catch (e) {
			if (e instanceof AxiosError) {
				if (e.response?.data[0] === 'Validation error')
					setError({
						error: true,
						msg: 'Email already exists.',
					})
			} else {
				setError({
					error: true,
					msg: 'Something went wrong...',
				})
			}
		}
	}

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		if (name === 'confirmPassword') {
			setConfPass(value)
		} else setRegister((prev) => ({ ...prev, [name]: value }))
		setError({ error: false, msg: '' })
	}

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12">
			{error.error && (
				<div className="fixed top-8 right-4 left-4 mx-auto max-w-md bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
					<div className="flex items-center">
						<AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
						<p className="text-sm text-red-700">{error.msg}</p>
					</div>
				</div>
			)}
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
				<div className="text-center">
					<ShoppingBag className="mx-auto h-12 w-12" />
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						{isBusinessRegister ? 'Register Your Business' : 'Create an Account'}
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						{isBusinessRegister
							? 'Join our marketplace as a seller'
							: 'Join our community of fashion enthusiasts'}
					</p>
				</div>

				<div className="flex justify-center space-x-4 mb-8">
					<button
						type="button"
						onClick={() => {
							setIsBusinessRegister(false)
							setRegister({ ...resetInputs, role_id: 2 })
						}}
						className={`flex items-center px-4 py-2 rounded-md ${
							!isBusinessRegister ? 'bg-black text-white' : 'bg-gray-100'
						}`}
					>
						<User className="h-4 w-4 mr-2" />
						Client
					</button>
					<button
						type="button"
						onClick={() => {
							setIsBusinessRegister(true)
							setRegister({ ...resetInputs, role_id: 1 })
						}}
						className={`flex items-center px-4 py-2 rounded-md ${
							isBusinessRegister ? 'bg-black text-white' : 'bg-gray-100'
						}`}
					>
						<Building2 className="h-4 w-4 mr-2" />
						Business
					</button>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						{isBusinessRegister ? (
							<>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Business Name
										<input
											name="name"
											type="text"
											value={register.name}
											required
											onInput={onInput}
											className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
										/>
									</label>
								</div>
							</>
						) : (
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Name
									<input
										name="name"
										type="text"
										value={register.name}
										required
										onInput={onInput}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
									/>
								</label>
							</div>
						)}

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email address
								<input
									name="email"
									value={register.email}
									required
									onInput={onInput}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
								/>
							</label>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Password
								<input
									name="password"
									type="password"
									value={register.password}
									required
									onInput={onInput}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
								/>
							</label>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Confirm Password
								<input
									name="confirmPassword"
									type="password"
									value={confPass}
									required
									onInput={onInput}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
								/>
							</label>
						</div>
					</div>

					{isBusinessRegister && (
						<div className="text-sm text-gray-600">
							By registering, you agree to our terms of service and seller agreement.
						</div>
					)}

					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
					>
						Create Account
					</button>

					<div className="text-center">
						<span className="text-sm text-gray-600">Already have an account? </span>
						<Link to="/auth/login" className="text-sm font-medium text-black hover:text-gray-800">
							Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

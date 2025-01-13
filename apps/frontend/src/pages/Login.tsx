import { sessionKeys } from '@/lib/utils'
import { validateEmail } from '@/lib/validators'
import { postRequest } from '@/services/requests'
import { UsersService } from '@/services/users'
import { setSession, setToken } from '@/store/sessionSlice'
import { AxiosError } from 'axios'
import { AlertCircle, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export const Login: React.FC<Login> = ({ login, setLogin }): React.ReactNode => {
	const [error, setError] = useState({ error: false, msg: '' })
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (validateEmail(login.email)) {
			setError({
				error: true,
				msg: 'Invalid email format. Please enter a valid email address (e.g., user@example.com).',
			})
			return
		}
		if (login.password.length < 8) {
			setError({
				error: true,
				msg: 'Password too short. It must be at least 8 characters long.',
			})
			return
		}

		try {
			const session = await postRequest<GetLogin>(UsersService.login(), login)

			if (session.status === 200) {
				dispatch(setToken(session.data.token))
				const keys = sessionKeys()
				if (!keys) return
				dispatch(setSession(keys))
				if (keys.role_id === 1) {
					navigate('/business')
				} else if (keys.role_id === 2) {
					navigate('/')
				}
			}
		} catch (e) {
			if (e instanceof AxiosError) {
				setError({
					error: true,
					msg: e.response?.data[0],
				})
				return
			}
			setError({
				error: true,
				msg: 'Something went wrong...',
			})
		}
	}

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setLogin((prev) => ({ ...prev, [name]: value }))
		setError({ error: false, msg: '' })
	}

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
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
					<h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome Back</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email address
								<input
									name="email"
									required
									value={login.email}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
									onInput={onInput}
								/>
							</label>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Password
								<input
									name="password"
									type="password"
									required
									value={login.password}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
									onInput={onInput}
								/>
							</label>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 border-gray-300 rounded"
							/>
							<label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
								Remember me
							</label>
						</div>
						<div className="text-sm">
							<a href="recovery" className="font-medium text-black hover:text-gray-800">
								Forgot password?
							</a>
						</div>
					</div>

					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
					>
						Sign in
					</button>

					<div className="text-center">
						<span className="text-sm text-gray-600">Don't have an account? </span>
						<Link
							to="/auth/register"
							className="text-sm font-medium text-black hover:text-gray-800"
						>
							Sign up
						</Link>
					</div>
					<div className="text-center">
						<span className="text-sm text-gray-600">Do you lose your activation? </span>
						<Link
							to="/auth/validation"
							className="text-sm font-medium text-black hover:text-gray-800"
						>
							Recovere it
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

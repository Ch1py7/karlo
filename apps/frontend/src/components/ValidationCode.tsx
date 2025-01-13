import { getValidationCode, removeValidationCode } from '@/lib/storage'
import { validateEmail } from '@/lib/validators'
import { getRequest, putRequest } from '@/services/requests'
import { UsersService } from '@/services/users'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { AlertCircle, Check, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const ValidationCode: React.FC = (): React.ReactNode => {
	const navigate = useNavigate()
	const [isCodeRecovery, setIsCodeRecovery] = useState(false)
	const [code, setCode] = useState<string>('')
	const [validation, setValidation] = useState<RecoverCode>({ email: '', validation_code: '' })
	const [alert, setAlert] = useState({ type: 0, theme: '', msg: '' })
	const { token } = useSelector((state: RootState) => state.session)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (validateEmail(validation.email)) {
			setAlert({
				type: 2,
				msg: 'Invalid email format. Please enter a valid email address (e.g., user@example.com).',
				theme: 'bg-red-100 text-red-800',
			})
			return
		}
    console.log(validation.email)
		try {
			const { data, status } = isCodeRecovery
				? await getRequest<string>(
						UsersService.getCode({ email: validation.email, password: validation.password! })
					)
				: await putRequest<GetRegister>(UsersService.validateUser(), validation)
			if (status === 200) {
				removeValidationCode()
				setAlert({
					type: 1,
					msg: isCodeRecovery ? 'Code recovered successfully!' : 'Account validated successfully!',
					theme: 'bg-green-100 text-green-800',
				})

				if (isCodeRecovery) {
					setCode(data.toString())
				}
				navigate('/auth/login')
			}
		} catch (e) {
			if (e instanceof AxiosError) {
				setAlert({
					type: 2,
					msg: e.response?.data[0],
					theme: 'bg-red-100 text-red-800',
				})
				return
			}
			setAlert({
				type: 2,
				msg: 'Something went wrong...',
				theme: 'bg-red-100 text-red-800',
			})
		} finally {
			setTimeout(() => {
				setAlert({
					type: 0,
					msg: '',
					theme: '',
				})
			}, 3000)
		}
	}

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setValidation((prev) => ({ ...prev, [name]: value }))
		setAlert({
			type: 0,
			msg: '',
			theme: '',
		})
	}

	useEffect(() => {
		if (token) {
			navigate('/')
		}
		setValidation((prev) => ({ ...prev, validation_code: getValidationCode(), password: '' }))
		setCode(getValidationCode())
	}, [navigate, token])

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
			{alert.type !== 0 && (
				<div
					className={`fixed top-8 right-4 left-4 mx-auto max-w-md ${alert.theme}  border  rounded-lg p-4 shadow-lg z-50`}
				>
					<div className="flex items-center">
						{alert.type === 1 && <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />}
						{alert.type === 2 && (
							<AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
						)}
						<p className="text-sm text-black">{alert.msg}</p>
					</div>
				</div>
			)}
			<div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
				{code && <h3 className="flex items-center px-4 py-2 rounded-md bg-black text-white justify-center">
					{code}
				</h3>}
				<div className="flex justify-center space-x-4 mb-8">
					<button
						type="button"
						onClick={() => {
							setIsCodeRecovery(false)
						}}
						className={`flex items-center px-4 py-2 rounded-md ${
							!isCodeRecovery ? 'bg-black text-white' : 'bg-gray-100'
						}`}
					>
						<Check className="h-4 w-4 mr-2" />
						Activation
					</button>
					<button
						type="button"
						onClick={() => {
							setIsCodeRecovery(true)
						}}
						className={`flex items-center px-4 py-2 rounded-md ${
							isCodeRecovery ? 'bg-black text-white' : 'bg-gray-100'
						}`}
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						Recovery
					</button>
				</div>
				<div className="text-center">
					<h2 className="mt-6 text-3xl font-bold text-gray-900">Validate your code!</h2>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="rounded-md shadow-sm space-y-4">
						<div>
							{isCodeRecovery ? (
								<label className="block text-sm font-medium text-gray-700">
									Password
									<input
										name="password"
										type="password"
										required
										value={validation.password}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
										onInput={onInput}
									/>
								</label>
							) : (
								<label className="block text-sm font-medium text-gray-700">
									Token (Copy it or don't forget it)
									<input
										name="validation_code"
										required
										value={validation.validation_code}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
										onInput={onInput}
									/>
								</label>
							)}
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email address
								<input
									name="email"
									required
									value={validation.email}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
									onInput={onInput}
								/>
							</label>
						</div>
					</div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
					>
						Validate
					</button>
				</form>
			</div>
		</div>
	)
}

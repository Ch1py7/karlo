import { Business } from '@/context/business.context'
import { BusinessesService } from '@/services/business'
import { postRequest } from '@/services/requests'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { X } from 'lucide-react'
import { useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from './Modal'

interface NewCompanyProps {
	setShowNewCompany: React.Dispatch<React.SetStateAction<boolean>>
	getBusiness: () => Promise<void>
	setAlert: React.Dispatch<
		React.SetStateAction<{
			type: number
			theme: string
			msg: string
		}>
	>
}

export const NewCompany: React.FC<NewCompanyProps> = ({
	setAlert,
	setShowNewCompany,
	getBusiness,
}): React.ReactNode => {
	const { reqBusiness } = useContext(Business.Context)
	const { token } = useSelector((state: RootState) => state.session)
	const [business, setBusiness] = useState<Business>({
		id: crypto.randomUUID(),
		name: '',
	})

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setAlert({
			type: 0,
			msg: '',
			theme: '',
		})

		setBusiness((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (business.name.length < 3 || business.name.length > 20) {
			setAlert({
				type: 2,
				msg: 'Name must be between 3 and 20 characters.',
				theme: 'bg-red-100 text-red-800',
			})
			return
		}

		try {
			const { status } = await postRequest<Business>(
				BusinessesService.createBusinesses(),
				business,
				token
			)
			if (status === 201 || status === 200) {
				setAlert({
					type: 1,
					msg: 'Company created successfully',
					theme: 'bg-green-100 text-green-800',
				})
			}
			setShowNewCompany(false)
			await reqBusiness()
		} catch (e) {
			if (e instanceof AxiosError) {
				if (e.response?.data[0] === 'Validation error')
					setAlert({
						type: 2,
						msg: 'Company name already exists.',
						theme: 'bg-red-100 text-red-800',
					})
			} else {
				setAlert({
					type: 2,
					msg: 'Something went wrong...',
					theme: 'bg-red-100 text-red-800',
				})
			}
		} finally {
			await getBusiness()
			setTimeout(() => {
				setAlert({
					type: 0,
					msg: '',
					theme: '',
				})
			}, 3000)
		}
	}

	return (
		<Modal>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">Add New Company</h2>
				<button
					type="button"
					onClick={() => {
						setShowNewCompany(false)
					}}
				>
					<X className="h-6 w-6 text-red-500 hover:text-red-700" />
				</button>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Product Name
						<input
							type="text"
							name="name"
              maxLength={20}
							value={business.name}
							onInput={onInput}
							className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black"
						/>
					</label>
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => {
								setShowNewCompany(false)
							}}
							className="px-4 py-2 border rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
						>
							Add Company
						</button>
					</div>
				</div>
			</form>
		</Modal>
	)
}

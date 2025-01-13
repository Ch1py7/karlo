import { CustomerOrders } from '@/components/CustomerOrders'
import { Modal } from '@/components/Modal'
import { sessionKeys } from '@/lib/utils'
import { getRequest, putRequest } from '@/services/requests'
import { UsersService } from '@/services/users'
import { manageTotals } from '@/store/cartSlice'
import { setToken } from '@/store/sessionSlice'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { AlertCircle, Check, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const Client: React.FC = (): React.ReactNode => {
	const [user, setUser] = useState<Pick<User, 'name' | 'id'>>({ name: '', id: '' })
	const [editName, setEditName] = useState(false)
	const [alert, setAlert] = useState({ type: 0, theme: '', msg: '' })
	const session = sessionKeys()
	const dispatch = useDispatch()
	const totals = useSelector((state: RootState) => state.cart.totals)
	const cart = useSelector((state: RootState) => state.cart.cart)
	const { token, name, id } = useSelector((state: RootState) => state.session)

	const onClick = async () => {
		if (user.name.length < 3 || user.name.length > 20) {
			setAlert({
				type: 2,
				msg: 'Name must be between 8 and 20 characters.',
				theme: 'bg-red-100 text-red-800',
			})
			return
		}

		try {
			const { status } = await putRequest(UsersService.updateUser(), user, token)
			if (status === 200) {
				setAlert({
					type: 1,
					msg: 'User edited successfully',
					theme: 'bg-green-100 text-green-800',
				})
				if (!session || session.id === '') return
				setEditName(false)
				const { data, status } = await getRequest<{ token: string }>(
					UsersService.getToken(session.id),
					token
				)
				if (status === 200) {
					dispatch(setToken(data.token))
				}
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
		const { value } = e.target
		setUser((prev) => ({ ...prev, name: value }))
	}

	useEffect(() => {
		setUser({ id: id, name: name })
	}, [name, id])

	useEffect(() => {
		if (cart.length === 0) return
		dispatch(manageTotals(cart))
	}, [cart, dispatch])

	return (
		<>
			{editName && (
				<Modal>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Edit confirmation</h2>
						<button type="button" onClick={() => setEditName(false)}>
							<X className="h-6 w-6 text-red-500 hover:text-red-700" />
						</button>
					</div>
					<div>
						<p className="text-lg">Are you sure you want to edit your name?</p>
					</div>
					<div className="flex justify-evenly mt-6">
						<button
							onClick={() => setEditName(false)}
							type="button"
							className="px-4 py-2 border rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => onClick()}
							className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
						>
							I'm sure
						</button>
					</div>
				</Modal>
			)}
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
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto">
					<div className="bg-white shadow rounded-lg p-8">
						<div className="flex items-center justify-center mb-8">
							<div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center">
								<User className="h-12 w-12 text-gray-500" />
							</div>
						</div>

						<div className="space-y-6">
							<div>
								<h2 className="text-2xl font-semibold text-center mb-8">Client Dashboard</h2>
								<div className="gap-4 mb-8">
									<div className="border rounded-lg p-4 text-center">
										<ShoppingBag className="h-8 w-8 mx-auto mb-2" />
										<p className="font-semibold">Products in Cart</p>
										<p className="text-2xl font-bold">{totals.totalProducts}</p>
									</div>
								</div>
							</div>

							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Personal Information</h3>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Name
											<input
												onInput={onInput}
												maxLength={20}
												value={user.name}
												type="text"
												className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black"
											/>
										</label>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Email
											<input
												type="email"
												value={session?.email}
												disabled
												className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-black"
											/>
										</label>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setEditName(true)}
									disabled={name === user.name}
									className={`w-full ${name === user.name ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} mt-4 text-white py-2 rounded-md`}
								>
									Save Changes
								</button>
							</div>
							<CustomerOrders setAlert={setAlert} />
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

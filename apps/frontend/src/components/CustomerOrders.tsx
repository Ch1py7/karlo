import { getStatus } from '@/lib/utils'
import { POrderService } from '@/services/porder'
import { getRequest, putRequest } from '@/services/requests'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { HandCoins, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from './Modal'

interface CustomerOrders {
	setAlert: React.Dispatch<
		React.SetStateAction<{
			type: number
			theme: string
			msg: string
		}>
	>
}

export const CustomerOrders: React.FC<CustomerOrders> = ({ setAlert }): React.ReactNode => {
	const [orders, setOrders] = useState<POrder[] | null>(null)
	const [orderToUpdate, setOrderToUpdate] = useState('')
	const [isCancel, setIsCancel] = useState(false)
	const { token, id, role_id } = useSelector((state: RootState) => state.session)

	const getOrders = useCallback(async () => {
		if (!id || !role_id) return
		const { data, status } = await getRequest<POrder[]>(
			POrderService.getPOrders(id, role_id.toString()),
			token
		)
		if (status === 200) {
			setOrders(data)
		}
	}, [id, role_id, token])

	const updateOrder = useCallback(async () => {
		try {
			const { status } = await putRequest(
				POrderService.updatePOrder(),
				{ id: orderToUpdate, status: isCancel ? 4 : 2 },
				token
			)
			if (status === 200) {
				getOrders()
				setOrderToUpdate('')
				setAlert({
					type: 1,
					msg: isCancel ? 'Order canceled successfully' : 'Order paid successfully',
					theme: 'bg-green-100 text-green-800',
				})
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
	}, [token, getOrders, orderToUpdate, setAlert, isCancel])

	useEffect(() => {
		getOrders()
	}, [getOrders])
	return (
		<>
			{orderToUpdate && (
				<Modal>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Cancel confirmation</h2>
						<button type="button" onClick={() => setOrderToUpdate('')}>
							<X className="h-6 w-6 text-red-500 hover:text-red-700" />
						</button>
					</div>
					<div>
						<p className="text-lg">Are you sure you want to cancel this order?</p>
					</div>
					<div className="flex justify-evenly mt-6">
						<button
							onClick={() => setOrderToUpdate('')}
							type="button"
							className="px-4 py-2 border rounded-lg hover:bg-gray-50"
						>
							Nope
						</button>
						<button
							type="button"
							onClick={() => updateOrder()}
							className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
						>
							I'm sure
						</button>
					</div>
				</Modal>
			)}
			<div>
				<h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
				<div className="space-y-4">
					{orders &&
						orders.map((order) => (
							<div key={order.id} className="border rounded-lg p-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="font-semibold">Order {order.id.split('-')[0]}</p>
									</div>
									<div className="flex justify-center items-center gap-2">
										<span
											className={`px-3 py-1 ${getStatus(order.status)?.theme} rounded-full text-sm`}
										>
											{getStatus(order.status)?.text}
										</span>
										<button
											type="button"
											title="Pay"
											onClick={() => {
												setIsCancel(false)
												setOrderToUpdate(order.id)
											}}
											className={`${
												order.status === 4 || order.status === 3 || order.status === 2
													? 'bg-gray-400'
													: 'bg-green-400 hover:bg-green-700'
											} px-4 py-2 text-white rounded-lg`}
											disabled={order.status === 4 || order.status === 3 || order.status === 2}
										>
											<HandCoins className="h-4 w-4" />
										</button>
										<button
											type="button"
											title="Cancel"
											onClick={() => {
												setIsCancel(true)
												setOrderToUpdate(order.id)
											}}
											disabled={order.status === 4 || order.status === 3 || order.status === 2}
											className={`${
												order.status === 4 || order.status === 3 || order.status === 2
													? 'bg-gray-400'
													: 'bg-red-400 hover:bg-red-700'
											} px-4 py-2 text-white rounded-lg`}
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</>
	)
}

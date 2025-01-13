import { getStatus } from '@/lib/utils'
import { POrderService } from '@/services/porder'
import { getRequest, putRequest } from '@/services/requests'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { Trash2, X } from 'lucide-react'
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
	const [orderToCancel, setOrderToCancel] = useState('')
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

	const cancelOrder = useCallback(async () => {
		try {
			const { status } = await putRequest(
				POrderService.updatePOrder(),
				{ id: orderToCancel, status: 4 },
				token
			)
			if (status === 200) {
				getOrders()
				setOrderToCancel('')
				setAlert({
					type: 1,
					msg: 'Order canceled successfully',
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
	}, [token, getOrders, orderToCancel, setAlert])

	useEffect(() => {
		getOrders()
	}, [getOrders])
	return (
		<>
			{orderToCancel && (
				<Modal>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Cancel confirmation</h2>
						<button type="button" onClick={() => setOrderToCancel('')}>
							<X className="h-6 w-6 text-red-500 hover:text-red-700" />
						</button>
					</div>
					<div>
						<p className="text-lg">Are you sure you want to cancel this order?</p>
					</div>
					<div className="flex justify-evenly mt-6">
						<button
							onClick={() => setOrderToCancel('')}
							type="button"
							className="px-4 py-2 border rounded-lg hover:bg-gray-50"
						>
							Nope
						</button>
						<button
							type="button"
							onClick={() => cancelOrder()}
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
											onClick={() => setOrderToCancel(order.id)}
											disabled={order.status === 4 || order.status === 3 || order.status === 2}
											className={`p-1 hover:bg-gray-100 rounded ${
												order.status === 4 || order.status === 3 || order.status === 2
													? 'text-gray-500'
													: 'text-red-500'
											} `}
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

import { Business } from '@/context/business.context'
import { getStatus } from '@/lib/utils'
import { POrderService } from '@/services/porder'
import { getRequest } from '@/services/requests'
import type { RootState } from '@/store/store'
import { Search } from 'lucide-react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { OrderDetails } from './OrderDetails'

export const BusinessOrders: React.FC = (): React.ReactNode => {
	const [orders, setOrders] = useState<POrder[] | null>(null)
	const [details, setDetails] = useState<POrderDetails | null>(null)
	const { token, role_id } = useSelector((state: RootState) => state.session)
	const { selectedBusiness } = useContext(Business.Context)
	const [searchTerm, setSearchTerm] = useState('')

	const getOrders = useCallback(async () => {
		if (!role_id || !selectedBusiness || selectedBusiness.id === '') return
		const { data, status } = await getRequest<POrder[]>(
			POrderService.getPOrders(selectedBusiness.id, role_id.toString(), searchTerm),
			token
		)
		if (status === 200) {
			setOrders(data.reverse())
		}
	}, [role_id, token, selectedBusiness, searchTerm])

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setSearchTerm(value)
	}

	useEffect(() => {
		getOrders()
	}, [getOrders])
	return (
		<>
			{details && (
				<OrderDetails getOrders={getOrders} selectedOrder={details} setSelectedOrder={setDetails} />
			)}
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Orders</h1>
					<div className="flex space-x-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Search orders..."
								onInput={onInput}
								className="pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-black"
							/>
							<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
						</div>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm overflow-hidden">
					<table className="min-w-full">
						<thead>
							<tr className="bg-gray-50 border-b">
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Total</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders &&
								orders.map((order, index) => (
									<tr key={index} className="border-b">
										<td className="px-6 py-4">
											<span className="font-medium">{order.id.split('-')[0]}</span>
										</td>
										<td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 ${getStatus(order.status)?.theme} rounded-full text-sm`}
											>
												{getStatus(order.status)?.text}
											</span>
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() =>
													setDetails({
														...order,
														products: JSON.parse(order.products),
													})
												}
												type="button"
												className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
											>
												View Details
											</button>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

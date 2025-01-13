import { getStatus } from '@/lib/utils'
import { POrderService } from '@/services/porder'
import { putRequest } from '@/services/requests'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { AlertCircle, Ban, Check, Hourglass, Undo2, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

interface OrderDetailsProps {
	selectedOrder: POrderDetails
	setSelectedOrder: React.Dispatch<React.SetStateAction<POrderDetails | null>>
	getOrders: () => Promise<void>
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
	selectedOrder,
	setSelectedOrder,
	getOrders,
}): React.ReactNode => {
	const { token } = useSelector((state: RootState) => state.session)
	const [alert, setAlert] = useState({ type: 0, theme: '', msg: '' })

	const updateOrderStatus = useCallback(
		async (statusToSend: number) => {
			try {
				const { status } = await putRequest(
					POrderService.updatePOrder(),
					{ id: selectedOrder.id, status: statusToSend },
					token
				)
				if (status === 200) {
					getOrders()
					setAlert({
						type: 1,
						msg: 'Status changed successfully',
						theme: 'bg-green-100 text-green-800',
					})
					setSelectedOrder(null)
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
		},
		[token, getOrders, selectedOrder.id, setSelectedOrder]
	)

	return (
		<>
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
			<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
				<div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
					<div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
						<h2 className="text-xl font-semibold">
							Order Details {selectedOrder?.id.split('-')[0]}
						</h2>
						<div className="flex items-center space-x-4">
							<button
								type="button"
								onClick={() => {
									setSelectedOrder(null)
								}}
								className="p-2 hover:bg-gray-100 rounded-full"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
					</div>
					<div className="p-6 space-y-6">
						<div className="grid grid-cols-4 gap-4">
							<div className="bg-gray-50 p-4 rounded-lg flex">
								<div>
									<p className="text-sm text-gray-500">Status</p>
									<p className="font-medium">
										<span
											className={`px-2 py-1 rounded-full text-sm ${getStatus(selectedOrder?.status)?.theme}`}
										>
											{getStatus(selectedOrder?.status)?.text}
										</span>
									</p>
								</div>
								<div className="flex items-center justify-center w-full">
									{selectedOrder?.status === 1 && <Hourglass className="w-6 h-6 text-yellow-800" />}
									{selectedOrder?.status === 2 && <Check className="w-6 h-6 text-green-800" />}
									{selectedOrder?.status === 3 && <Undo2 className="w-6 h-6 text-orange-800" />}
									{selectedOrder?.status === 4 && <Ban className="w-6 h-6 text-red-800" />}
								</div>
							</div>
						</div>
						<div>
							<h3 className="font-medium mb-4">Order Items</h3>
							<div className="border rounded-lg overflow-hidden">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Product
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Quantity
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Price
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
												Total
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{selectedOrder &&
											selectedOrder.products.map((item) => (
												<tr key={item.id}>
													<td className="px-6 py-4">
														<div className="flex items-center">
															<span className="ml-4">{item.name}</span>
														</div>
													</td>
													<td className="px-6 py-4">{item?.quantity}</td>
													<td className="px-6 py-4">${item?.price.toFixed(2)}</td>
													<td className="px-6 py-4">
														${(item?.price * item?.quantity).toFixed(2)}
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						</div>
						<div className="border-t pt-4">
							<div className="max-w-xs ml-auto space-y-2">
								<div className="flex justify-between">
									<span className="text-gray-500">Subtotal</span>
									<span>${selectedOrder.subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Tax</span>
									<span>
										$
										{Number(
											selectedOrder.products.reduce(
												(total, prod) => total + prod.price * prod.quantity,
												0
											) * selectedOrder.tax
										).toLocaleString('en-US', { minimumFractionDigits: 2 })}
									</span>
								</div>
								<div className="flex justify-between font-medium text-lg border-t pt-2">
									<span>Total</span>
									<span>${selectedOrder.total.toFixed(2)}</span>
								</div>
							</div>
						</div>
						<div className="flex justify-end space-x-4 border-t pt-6">
							<button
								type="button"
								onClick={() => updateOrderStatus(3)}
								className={`${
									selectedOrder.status === 4 ||
									selectedOrder.status === 3 ||
									selectedOrder.status === 2
										? 'bg-gray-100 text-gray-400'
										: 'hover:bg-gray-50'
								} px-4 py-2 border rounded-lg`}
								disabled={
									selectedOrder.status === 4 ||
									selectedOrder.status === 3 ||
									selectedOrder.status === 2
								}
							>
								Return Order
							</button>
							<button
								type="button"
								onClick={() => updateOrderStatus(2)}
								className={`${
									selectedOrder.status === 4 ||
									selectedOrder.status === 3 ||
									selectedOrder.status === 2
										? 'bg-gray-400'
										: 'bg-black hover:bg-gray-800'
								} px-4 py-2 text-white rounded-lg`}
								disabled={
									selectedOrder.status === 4 ||
									selectedOrder.status === 3 ||
									selectedOrder.status === 2
								}
							>
								Mark as Paid
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

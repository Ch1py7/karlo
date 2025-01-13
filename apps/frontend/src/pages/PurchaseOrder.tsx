import { Modal } from '@/components/Modal'
import { Business } from '@/context/business.context'
import { POrderService } from '@/services/porder'
import { getRequest, postRequest } from '@/services/requests'
import { TaxService } from '@/services/tax'
import { addProduct, cleanCart, manageTotals, removeProduct, restProduct } from '@/store/cartSlice'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { AlertCircle, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const PurchaseOrder: React.FC = (): React.ReactNode => {
	const dispatch = useDispatch()
	const [tax, setTax] = useState(0)
	const [pOrder, setPOrder] = useState<POrder | null>()
	const totals = useSelector((state: RootState) => state.cart.totals)
	const cart = useSelector((state: RootState) => state.cart.cart)
	const { token, id } = useSelector((state: RootState) => state.session)
	const { selectedBusiness } = useContext(Business.Context)
	const [alert, setAlert] = useState({ type: 0, theme: '', msg: '' })
	const [orderToSend, setOrderToSend] = useState(false)

	const subtotal = totals.totalOrder
	const total = totals.totalOrder + totals.totalOrder * tax

	const getTax = useCallback(async () => {
		if (!token) return
		const { data } = await getRequest<number>(TaxService.getTax(), token)
		setTax(data / 100)
	}, [token])

	const sendOrder = useCallback(async () => {
		try {
			const { status } = await postRequest(POrderService.createPOrder(), pOrder, token)

			if (status === 201) {
				setAlert({
					type: 1,
					msg: 'Order placed successfully!',
					theme: 'bg-green-100 text-green-800',
				})
				setOrderToSend(false)
				dispatch(cleanCart())
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
	}, [pOrder, token, dispatch])

	useEffect(() => {
		getTax()
	}, [getTax])

	useEffect(() => {
		dispatch(manageTotals(cart))
	}, [cart, dispatch])

	useEffect(() => {
		if (selectedBusiness?.id) {
			setPOrder({
				id: crypto.randomUUID().toString(),
				business_id: selectedBusiness!.id,
				status: 1,
				subtotal: Number(subtotal.toFixed(2)),
				total: Number(total.toFixed(2)),
				tax: tax,
				user_id: id,
				products: JSON.stringify(cart),
			})
		}
	}, [id, selectedBusiness, tax, cart, subtotal.toFixed, total.toFixed])

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
			{orderToSend && (
				<Modal>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Confirmation</h2>
						<button type="button" onClick={() => setOrderToSend(false)}>
							<X className="h-6 w-6 text-red-500 hover:text-red-700" />
						</button>
					</div>
					<div>
						<p className="text-lg">Are you sure you want to order this?</p>
					</div>
					<div className="flex justify-evenly mt-6">
						<button
							type="button"
							onClick={() => setOrderToSend(false)}
							className="px-4 py-2 border rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => sendOrder()}
							className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
						>
							Place order
						</button>
					</div>
				</Modal>
			)}
			<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-8">
						<ShoppingBag className="h-12 w-12 mx-auto mb-4" />
						<h1 className="text-3xl font-bold">Complete Your Purchase</h1>
					</div>

					<div className="bg-white shadow rounded-lg p-6 mb-6">
						<h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
						{cart.length > 0 ? (
							cart.map((item) => (
								<div key={item.id} className="space-y-4">
									<div className="flex items-center justify-between border-b pb-4">
										<div className="flex items-center space-x-4">
											<div>
												<p className="font-medium">{item.name}</p>
											</div>
										</div>
										<div className="text-right">
											<p className="font-medium">
												$
												{(item.price + item.price * tax).toLocaleString('en-us', {
													minimumFractionDigits: 2,
												})}
											</p>
											<span className="font-medium">{item.quantity} pcs</span>
											<button
												onClick={() =>
													dispatch(
														addProduct({
															id: item.id,
															name: item.name,
															price: item.price,
															quantity: 1,
														})
													)
												}
												type="button"
												className="p-1 hover:bg-gray-100 rounded text-black"
											>
												<Plus className="h-5 w-5" />
											</button>
											<button
												onClick={() =>
													dispatch(
														restProduct({
															id: item.id,
															name: item.name,
															price: item.price,
															quantity: 1,
														})
													)
												}
												disabled={item.quantity === 1}
												type="button"
												className={`p-1 hover:bg-gray-100 rounded ${item.quantity === 1 ? 'text-gray-400' : 'text-black'}`}
											>
												<Minus className="h-5 w-5" />
											</button>
											<button
												onClick={() => dispatch(removeProduct(item.name))}
												type="button"
												className="p-1 hover:bg-gray-100 rounded text-red-500"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>
							))
						) : (
							<>nothing here</>
						)}
						<div className="mt-6">
							<div className="flex justify-between mb-2">
								<p>Subtotal</p>
								<p>${subtotal.toFixed(2)}</p>
							</div>
							<div className="flex justify-between font-semibold">
								<p>Total</p>
								<p>${total.toFixed(2)}</p>
							</div>
						</div>
					</div>
					<div className="flex">
						<button
							type="button"
							onClick={() => setOrderToSend(true)}
							disabled={cart.length <= 0}
							className={`px-6 py-2 ${cart.length <= 0 ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'} text-white rounded-md ml-auto`}
						>
							Place Order
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

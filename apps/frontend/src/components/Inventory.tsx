import { Business } from '@/context/business.context'
import { ProductsService } from '@/services/products'
import { deleteRequest, getRequest } from '@/services/requests'
import type { RootState } from '@/store/store'
import { AxiosError } from 'axios'
import { AlertCircle, Check, Edit, Plus, Search, Trash2, X } from 'lucide-react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from './Modal'
import { NewProduct } from './NewProduct'

export const Inventory: React.FC = (): React.ReactNode => {
	const [showNewProduct, setShowNewProduct] = useState(false)
	const [products, setProducts] = useState<Product[]>([])
	const [productToDelete, setProductToDelete] = useState('')
	const [productToEdit, setProductToEdit] = useState<Product | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [alert, setAlert] = useState({ type: 0, theme: '', msg: '' })
	const { loading, selectedBusiness } = useContext(Business.Context)
	const { token } = useSelector((state: RootState) => state.session)

	const getProducts = useCallback(async () => {
		if (loading) return
		const { data, status } = await getRequest<Product[]>(
			ProductsService.getProducts(selectedBusiness!.id, searchTerm)
		)

		if (status === 200) setProducts(data)
	}, [loading, searchTerm, selectedBusiness])

	const deleteItem = useCallback(async () => {
		try {
			if (!token) return
			const { status } = await deleteRequest(ProductsService.deleteProduct(productToDelete), token)
			if (status === 200) {
				setAlert({
					type: 1,
					msg: 'Product deleted successfully!',
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
			getProducts()
			setProductToDelete('')
			setTimeout(() => {
				setAlert({
					type: 0,
					msg: '',
					theme: '',
				})
			}, 3000)
		}
	}, [getProducts, productToDelete, token])

	const setStockStatus = (stock: number) => {
		if (stock >= 5) {
			return 'bg-green-100 text-green-800'
		}
		if (stock < 5 && stock >= 3) {
			return 'bg-yellow-100 text-yellow-800'
		}
		if (stock < 3) {
			return 'bg-red-100 text-red-800'
		}
	}

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target

		setSearchTerm(value)
	}

	useEffect(() => {
		getProducts()
	}, [getProducts])

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
			{productToDelete && (
				<Modal>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Delete confirmation</h2>
						<button type="button" onClick={() => setProductToDelete('')}>
							<X className="h-6 w-6 text-red-500 hover:text-red-700" />
						</button>
					</div>
					<div>
						<p className="text-lg">Are you sure you want to delete this item?</p>
					</div>
					<div className="flex justify-evenly mt-6">
						<button
							type="button"
							onClick={() => setProductToDelete('')}
							className="px-4 py-2 border rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={() => deleteItem()}
							className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
						>
							Delete
						</button>
					</div>
				</Modal>
			)}
			{(showNewProduct || productToEdit) && (
				<NewProduct
					productToEdit={productToEdit}
					setProductToEdit={setProductToEdit}
					setAlert={setAlert}
					getProducts={getProducts}
					setShowNewProduct={setShowNewProduct}
				/>
			)}
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Inventory Management</h1>
					<button
						type="button"
						onClick={() => setShowNewProduct(true)}
						className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
					>
						<Plus className="h-5 w-5" />
						<span>Add Product</span>
					</button>
				</div>
				<div className="flex space-x-4 items-center">
					<div className="relative">
						<input
							type="text"
							placeholder="Search products..."
							onInput={onInput}
							className="pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-black"
						/>
						<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-sm">
					<table className="min-w-full">
						<thead>
							<tr className="border-b">
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ID</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
								<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr className="border-b">
									<td className="text-center mt-12">
										<p>Loading products...</p>
									</td>
								</tr>
							) : (
								products &&
								products.map((product) => (
									<tr key={product.id} className="border-b">
										<td className="px-6 py-4">
											<span>{product.id.split('-')[0]}</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center space-x-3">
												<span>{product.name}</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 ${setStockStatus(product.stock)} rounded-full text-sm`}
											>
												In Stock ({product.stock.toLocaleString('en-US')})
											</span>
										</td>
										<td className="px-6 py-4">
											${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
										</td>
										<td className="px-6 py-4">
											<div className="flex space-x-2">
												<button
													onClick={() => setProductToEdit(product)}
													type="button"
													className="p-1 hover:bg-gray-100 rounded"
												>
													<Edit className="h-4 w-4" />
												</button>
												<button
													onClick={() => setProductToDelete(product.id)}
													type="button"
													className="p-1 hover:bg-gray-100 rounded text-red-500"
												>
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}

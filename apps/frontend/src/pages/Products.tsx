import { Business } from '@/context/business.context'
import { ProductsService } from '@/services/products'
import { getRequest } from '@/services/requests'
import { TaxService } from '@/services/tax'
import { addProduct, createCart } from '@/store/cartSlice'
import type { RootState } from '@/store/store'
import { Search } from 'lucide-react'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const Products: React.FC = (): React.ReactNode => {
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('')
	const [products, setProducts] = useState<Product[]>([])
	const { selectedBusiness } = useContext(Business.Context)
	const [tax, setTax] = useState(0)
	const dispatch = useDispatch()
	const { token, role_id } = useSelector((state: RootState) => state.session)
	const { cart } = useSelector((state: RootState) => state.cart)

	const disabledProduct = (product: Product) => {
		if (!cart) return
		return (
			cart &&
			cart.some((cartProduct) => cartProduct.id === product.id && cartProduct.quantity === 0)
		)
	}

	const updateProductStock = (productId: string) => {
		setProducts((prevProducts) =>
			prevProducts.map((product) =>
				product.id === productId ? { ...product, stock: product.stock - 1 } : product
			)
		)
	}

	const updateProductsFromCart = useCallback(
		(fetchedProducts: Product[]) => {
			if (!cart || cart.length === 0) return
			setProducts((prevProducts) => {
				const updatedProducts = fetchedProducts.map((product) => {
					const cartItem = cart.find((item) => item.id === product.id)
					if (cartItem) {
						return {
							...product,
							stock: Math.max(0, product.stock - cartItem.quantity),
						}
					}
					return product
				})
				if (JSON.stringify(prevProducts) !== JSON.stringify(updatedProducts)) {
					return updatedProducts
				}
				return prevProducts
			})
		},
		[cart]
	)

	const getTax = useCallback(async () => {
		if (!token) return
		const { data } = await getRequest<number>(TaxService.getTax(), token)
		setTax(data / 100)
	}, [token])

	const getProducts = useCallback(async () => {
		if (!selectedBusiness || selectedBusiness.id === '') return
		const { data, status } = await getRequest<Product[]>(
			ProductsService.getProducts(selectedBusiness.id, searchTerm)
		)

		if (status === 200) {
			setProducts(data)
			updateProductsFromCart(data)
		}
	}, [searchTerm, selectedBusiness, updateProductsFromCart])

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target

		setSearchTerm(value)
	}

	useEffect(() => {
		getTax()
	}, [getTax])

	useEffect(() => {
		const cartExists = localStorage.getItem('CartStorageData')
		if (!cartExists) dispatch(createCart())
	}, [dispatch])

	useEffect(() => {
		if (role_id === 1) {
			navigate('/business')
		}
	}, [navigate, role_id])

	useEffect(() => {
		getProducts()
	}, [getProducts])

	return (
		<div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative">
			<div className="absolute top-2 right-5">
				<input
					type="text"
					placeholder="Search products..."
					onInput={onInput}
					className="pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-black"
				/>
				<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
			</div>
			{products ? (
				<div className="text-center mb-12 mt-2">
					<h1 className="text-3xl font-bold mb-4">Our Collection</h1>
					<p className="text-gray-600">Timeless pieces for your wardrobe</p>
				</div>
			) : (
				<div className="text-center mb-12 mt-2">
					<h1 className="text-3xl font-bold mb-4">Oops!</h1>
					<p className="text-gray-600">It looks like we have nothing for now.</p>
				</div>
			)}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{products.map((product) => (
					<div key={product.id} className="group relative">
						<div className="aspect-w-3 aspect-h-4 overflow-hidden rounded-lg">
							<img
								src="/No_image_available.png"
								alt={product.name}
								className="h-[400px] w-full object-cover object-center group-hover:opacity-75"
							/>
						</div>
						<div className="mt-4">
							<div className="flex justify-between">
								<div>
									<h3 className="text-lg font-medium">{product.name}</h3>
									<p className="text-gray-600">
										$
										{(product.price + product.price * tax).toLocaleString('en-US', {
											minimumFractionDigits: 2,
										})}
									</p>
								</div>
								<h3 className="text-lg font-medium">{product.stock} pcs</h3>
							</div>
							<button
								type="button"
								disabled={disabledProduct(product) || product.stock === 0}
								onClick={() => {
									if (token === 'undefined' || token === null || token === '') {
										navigate('/auth/login')
									} else {
										dispatch(
											addProduct({
												id: product.id,
												name: product.name,
												price: product.price,
												quantity: 1,
											})
										)
										updateProductStock(product.id)
									}
								}}
								className={`mt-2 w-full ${disabledProduct(product) || product.stock === 0 ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'} bg-black text-white px-4 py-2 rounded-md `}
							>
								Add to Cart
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

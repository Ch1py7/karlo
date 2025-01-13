import { Business } from '@/context/business.context'
import { ProductsService } from '@/services/products'
import { postRequest, putRequest } from '@/services/requests'
import type { RootState } from '@/store/store'
import { X } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from './Modal'
import { AxiosError } from 'axios'

interface NewProductProps {
	setShowNewProduct: React.Dispatch<React.SetStateAction<boolean>>
	getProducts: () => Promise<void>
	productToEdit: Product | null
	setProductToEdit: React.Dispatch<React.SetStateAction<Product | null>>
	setAlert: React.Dispatch<
		React.SetStateAction<{
			type: number
			theme: string
			msg: string
		}>
	>
}

const deleteZero = /^0+/

export const NewProduct: React.FC<NewProductProps> = ({
	setShowNewProduct,
	getProducts,
	setAlert,
	productToEdit,
	setProductToEdit,
}): React.ReactNode => {
	const { token } = useSelector((state: RootState) => state.session)
	const { selectedBusiness } = useContext(Business.Context)
	const [product, setProduct] = useState<Product>({
		id: crypto.randomUUID(),
		business_id: '',
		name: '',
		price: 0,
		stock: 0,
	})

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setAlert({
			type: 0,
			msg: '',
			theme: '',
		})

		setProduct((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (product.name.length < 3) {
			setAlert({
				type: 2,
				msg: 'Name too short. It must be at least 3 characters long.',
				theme: 'bg-red-100 text-red-800',
			})
			return
		}
		if (product.stock <= 0) {
			setAlert({
				type: 2,
				msg: "Stock can't be 0 or less.",
				theme: 'bg-red-100 text-red-800',
			})
			return
		}

		if (product.price <= 0) {
			setAlert({
				type: 2,
				msg: "Price can't be 0 or less.",
				theme: 'bg-red-100 text-red-800',
			})
			return
		}

		if (product.stock.toString().startsWith('0') && product.stock.toString().length > 1) {
			setProduct((prev) => ({
				...prev,
				stock: Number(product.stock.toString().replace(deleteZero, '')),
			}))
		}

		if (product.price.toString().startsWith('0') && product.price.toString().length > 1) {
			setProduct((prev) => ({
				...prev,
				price: Number(product.price.toString().replace(deleteZero, '')),
			}))
		}

		try {
			if (!token) return
			const { status } = productToEdit
				? await putRequest<Product>(ProductsService.updateProduct(), product, token)
				: await postRequest<Product>(ProductsService.createProduct(), product, token)
			if (status === 201 || status === 200) {
				setAlert({
					type: 1,
					msg: productToEdit ? 'Product edited successfully' : 'Product created successfully!',
					theme: 'bg-green-100 text-green-800',
				})
			}
			setShowNewProduct(false)
			setProductToEdit(null)
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
			await getProducts()
			setTimeout(() => {
				setAlert({
					type: 0,
					msg: '',
					theme: '',
				})
			}, 3000)
		}
	}

	useEffect(() => {
		setProduct((prev) => ({ ...prev, business_id: selectedBusiness!.id }))
	}, [selectedBusiness])

	useEffect(() => {
		if (productToEdit) {
			setProduct(productToEdit)
		}
	}, [productToEdit])
	return (
		<Modal>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">{`${productToEdit ? 'Edit Product' : 'Add New Product'}`}</h2>
				<button
					type="button"
					onClick={() => {
						setShowNewProduct(false)
						setProductToEdit(null)
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
							value={product.name}
							onInput={onInput}
							className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black"
						/>
					</label>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Price
								<input
									type="text"
									name="price"
									value={product.price}
									onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
										const target = e.currentTarget
										target.value = target.value.replace(/[^0-9.]/g, '')
										onInput(e)
									}}
									className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black"
								/>
							</label>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Stock
								<input
									type="text"
									name="stock"
									value={product.stock}
									onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
										const target = e.currentTarget
										target.value = target.value.replace(/[^0-9]/g, '')
										onInput(e)
									}}
									className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black"
								/>
							</label>
						</div>
					</div>
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={() => {
								setShowNewProduct(false)
								setProductToEdit(null)
							}}
							className="px-4 py-2 border rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
						>
							{`${productToEdit ? 'Edit Product' : 'Add Product'}`}
						</button>
					</div>
				</div>
			</form>
		</Modal>
	)
}

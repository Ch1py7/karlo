export namespace ProductsService {
	export const getProducts = (businessId: string, search?: string) => {
		return `https://karlo.onrender.com/api/products?business_id=${businessId}${search ? `&search=${search}` : ''}`
	}
	export const deleteProduct = (productId: string) => {
		return `https://karlo.onrender.com/api/products/delete?id=${productId}`
	}
	export const createProduct = () => {
		return 'https://karlo.onrender.com/api/products/create'
	}
	export const updateProduct = () => {
		return 'https://karlo.onrender.com/api/products/update'
	}
}

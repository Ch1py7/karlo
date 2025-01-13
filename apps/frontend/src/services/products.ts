export namespace ProductsService {
	export const getProducts = (businessId: string, search?: string) => {
		return `http://localhost:473/api/products?business_id=${businessId}${search ? `&search=${search}` : ''}`
	}
	export const deleteProduct = (productId: string) => {
		return `http://localhost:473/api/products/delete?id=${productId}`
	}
	export const createProduct = () => {
		return 'http://localhost:473/api/products/create'
	}
	export const updateProduct = () => {
		return 'http://localhost:473/api/products/update'
	}
}

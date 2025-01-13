export namespace BusinessesService {
	export const getBusinesses = (search?: string) => {
		return `http://localhost:473/api/business${search ? `?search=${search}` : ''}`
	}

	export const createBusinesses = () => {
		return 'http://localhost:473/api/business/create'
	}
}

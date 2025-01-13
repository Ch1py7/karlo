export namespace BusinessesService {
	export const getBusinesses = (search?: string) => {
		return `https://karlo.onrender.com/api/business${search ? `?search=${search}` : ''}`
	}

	export const createBusinesses = () => {
		return 'https://karlo.onrender.com/api/business/create'
	}
}

export namespace POrderService {
	export const getPOrders = (id: string, role_id: string, search?: string) => {
		return `https://karlo.onrender.com/api/porder?id=${id}&role_id=${role_id}${search ? `&search=${search}` : ''}`
	}
	export const deletePOrder = (POrderId: string) => {
		return `https://karlo.onrender.com/api/porder/delete?id=${POrderId}`
	}
	export const createPOrder = () => {
		return 'https://karlo.onrender.com/api/porder/create'
	}
	export const updatePOrder = () => {
		return 'https://karlo.onrender.com/api/porder/update'
	}
}

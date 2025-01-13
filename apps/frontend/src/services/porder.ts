export namespace POrderService {
	export const getPOrders = (id: string, role_id: string, search?: string) => {
		return `http://localhost:473/api/porder?id=${id}&role_id=${role_id}${search ? `&search=${search}` : ''}`
	}
	export const deletePOrder = (POrderId: string) => {
		return `http://localhost:473/api/porder/delete?id=${POrderId}`
	}
	export const createPOrder = () => {
		return 'http://localhost:473/api/porder/create'
	}
	export const updatePOrder = () => {
		return 'http://localhost:473/api/porder/update'
	}
}

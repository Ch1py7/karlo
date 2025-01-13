import axios, { AxiosError } from 'axios'

export const postRequest = async <T>(url: string, data: any, token?: string) => {
	try {
		const config = {
			headers: { Authorization: `Bearer ${token}` },
		}
		const response = (await axios.post(url, data, config)) as { data: T; status: number }

		return { data: response.data, status: response.status }
	} catch (er) {
		if (er instanceof AxiosError) {
			throw er
		}
		throw [(er as Error).message]
	}
}

export const getRequest = async <T>(url: string, token?: string) => {
	try {
		const config = {
			headers: { Authorization: `Bearer ${token ? token : ''}` },
		}
		const response = (await axios.get(url, config)) as { data: T; status: number }

		return { data: response.data, status: response.status }
	} catch (er) {
		if (er instanceof AxiosError) {
			throw er
		}
		throw [(er as Error).message]
	}
}

export const deleteRequest = async <T>(url: string, token: string) => {
	try {
		const config = {
			headers: { Authorization: `Bearer ${token}` },
		}
		const response = (await axios.delete(url, config)) as { data: T; status: number }

		return { data: response.data, status: response.status }
	} catch (er) {
		if (er instanceof AxiosError) {
			throw er
		}
		throw [(er as Error).message]
	}
}

export const putRequest = async <T>(url: string, data: T, token?: string) => {
	try {
		const config = {
			headers: { Authorization: `Bearer ${token}` },
		}
		const response = (await axios.put(url, data, config)) as { data: T; status: number }

		return { data: response.data, status: response.status }
	} catch (er) {
		if (er instanceof AxiosError) {
			throw er
		}
		throw [(er as Error).message]
	}
}

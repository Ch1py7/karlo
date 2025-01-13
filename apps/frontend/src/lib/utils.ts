export const sessionKeys = (): Token | undefined => {
	const jwt = localStorage.getItem('token')
	if (!jwt) return

	const payload = jwt.split('.')[1]
	const { sub, role_id, is_validated, name, email } = JSON.parse(atob(payload))

	return { id: sub, role_id, is_validated, name, email }
}

export const getStatus = (status: number) => {
	switch (status) {
		case 1:
			return { text: 'Pending', theme: 'bg-yellow-100 text-yellow-800' }
		case 2:
			return { text: 'Paid', theme: 'bg-green-100 text-green-800' }
		case 3:
			return { text: 'Returned', theme: 'bg-orange-100 text-orange-800' }
		case 4:
			return { text: 'Cancelled', theme: 'bg-red-100 text-red-800' }
	}
}

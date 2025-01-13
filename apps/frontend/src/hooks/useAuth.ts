import { sessionKeys } from '@/lib/utils'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const useAuthorization = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const keys = sessionKeys()
		const { pathname } = window.location

		if (keys) {
			if (!keys.role_id) {
				navigate('/auth/login', { replace: true })
			}
			if (keys.role_id === 1) {
				navigate('/business', { replace: true })
			}
			if (keys.role_id === 2) {
				if (pathname === '/client' || pathname === '/purchase') return
				navigate('/', { replace: true })
			}
		} else {
			navigate('/', { replace: true })
		}
	}, [navigate])
}

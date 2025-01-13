import { useAuthorization } from '@/hooks/useAuth'
import { Outlet } from 'react-router-dom'

export const ProtectedRoute: React.FC = (): React.ReactNode => {
	useAuthorization()

	return <Outlet />
}

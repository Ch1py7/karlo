import { Business } from '@/context/business.context'
import { removeSession } from '@/lib/storage'
import type { RootState } from '@/store/store'
import { Building2, ShoppingBag, User } from 'lucide-react'
import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { SelectBusiness } from './SelectBusiness'

export const Navbar: React.FC = (): React.ReactNode => {
	const {
		businesses,
		searchTerm,
		selectedBusiness,
		setSearchTerm,
		setSelectedBusiness,
		setShowBusinessSelector,
		showBusinessSelector,
	} = useContext(Business.Context)
	const session = useSelector((state: RootState) => state.session)
	const navigate = useNavigate()

	const leaveAccount = () => {
		removeSession()
		navigate('/')
		window.location.reload()
	}

	return (
		<>
			{showBusinessSelector && (
				<SelectBusiness
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					businesses={businesses}
					setShowBusinessSelector={setShowBusinessSelector}
					selectedBusiness={selectedBusiness}
					setSelectedBusiness={setSelectedBusiness}
				/>
			)}
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						<Link to="/" className="flex items-center space-x-2">
							<ShoppingBag className="h-6 w-6" />
							<span className="font-semibold text-xl">MINIMALIST</span>
						</Link>
						<div className="flex space-x-8">
							<button
								type="button"
								onClick={() => setShowBusinessSelector(true)}
								className="flex items-center space-x-2 bg-white px-4 py-2 rounded-md shadow-md hover:bg-gray-50"
							>
								<Building2 className="h-5 w-5" />
								<span>{selectedBusiness?.name}</span>
							</button>
							{session.role_id === 1 && (
								<Link to="/business" className="text-gray-700 hover:text-black flex items-center">
									Dashboard
								</Link>
							)}
							{session.role_id !== 1 && (
								<Link to="/" className="text-gray-700 hover:text-black flex items-center">
									Shop
								</Link>
							)}
							{session.role_id === 2 && (
								<>
									<Link to="/client" className="text-gray-700 hover:text-black flex items-center">
										Account
									</Link>
									<Link to="/purchase" className="text-gray-700 hover:text-black flex items-center">
										Cart
									</Link>
								</>
							)}
							{session.token ? (
								<button
									type="button"
									onClick={() => leaveAccount()}
									className="text-gray-700 hover:text-black flex items-center"
								>
									Logout
								</button>
							) : (
								<Link
									to="/auth/login"
									className="flex items-center space-x-1 text-gray-700 hover:text-black"
								>
									<User className="h-5 w-5" />
								</Link>
							)}
						</div>
					</div>
				</div>
			</nav>
		</>
	)
}

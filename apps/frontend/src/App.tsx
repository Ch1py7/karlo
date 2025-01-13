import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ValidationCode } from './components/ValidationCode'
import { Business as BusinessContext } from './context/business.context'
import { sessionKeys } from './lib/utils'
import { Auth } from './pages/Auth'
import { Business } from './pages/Business'
import { Client } from './pages/Client'
import { Products } from './pages/Products'
import { PurchaseOrder } from './pages/PurchaseOrder'
import { setSession, setToken } from './store/sessionSlice'

export const App: React.FC = (): React.ReactNode => {
	const dispatch = useDispatch()
	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			dispatch(setToken(token))
			const keys = sessionKeys()
			if (keys) dispatch(setSession(keys))
		}
	}, [dispatch])
	return (
		<Router>
			<div className="min-h-screen flex flex-col">
				<BusinessContext.Provider>
					<Navbar />
					<main className="flex-grow">
						<Routes>
							<Route path="/auth/*" element={<Auth />} />
							<Route path="/auth/validation" element={<ValidationCode />} />
							<Route element={<ProtectedRoute />}>
								<Route path="/" element={<Products />} />
								<Route path="/business" element={<Business />} />
								<Route path="/client" element={<Client />} />
								<Route path="/purchase" element={<PurchaseOrder />} />
							</Route>
						</Routes>
					</main>
					<Footer />
				</BusinessContext.Provider>
			</div>
		</Router>
	)
}

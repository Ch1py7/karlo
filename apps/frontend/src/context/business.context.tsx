import { BusinessesService } from '@/services/business'
import { getRequest } from '@/services/requests'
import { createContext, useCallback, useEffect, useState } from 'react'

interface BusinessContextState {
	businesses: Business[] | null
	showBusinessSelector: boolean
	setShowBusinessSelector: React.Dispatch<React.SetStateAction<boolean>>
	searchTerm: string
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>
	selectedBusiness: Business | null
	setSelectedBusiness: React.Dispatch<React.SetStateAction<Business | null>>
	reqBusiness: () => Promise<void>
	loading: boolean
}

interface BusinessProviderProps {
	children: React.ReactNode
}

const Context = createContext<BusinessContextState>({
	businesses: null,
	showBusinessSelector: false,
	setShowBusinessSelector: () => {},
	searchTerm: '',
	setSearchTerm: () => {},
	selectedBusiness: null,
	setSelectedBusiness: () => {},
	reqBusiness: async () => {},
	loading: false,
})

const Provider: React.FC<BusinessProviderProps> = ({ children }) => {
	const [showBusinessSelector, setShowBusinessSelector] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
	const [businesses, setBusinesses] = useState<Business[]>([])
	const [loading, setLoading] = useState(false)

	const reqBusiness = useCallback(async () => {
		const { data, status } = await getRequest<Business[]>(
			BusinessesService.getBusinesses(searchTerm)
		)

		if (status === 200) {
			setBusinesses(data)
		}
	}, [searchTerm])

	useEffect(() => {
		if (businesses.length > 0) {
			setSelectedBusiness(businesses[0])
		} else {
			setSelectedBusiness({ id: '', name: '' })
		}
	}, [businesses])

	useEffect(() => {
		if (selectedBusiness) {
			setLoading(true)
			setTimeout(() => setLoading(false), 100)
		}
	}, [selectedBusiness])

	useEffect(() => {
		reqBusiness()
	}, [reqBusiness])

	return (
		<Context.Provider
			value={{
				businesses,
				showBusinessSelector,
				setShowBusinessSelector,
				searchTerm,
				setSearchTerm,
				selectedBusiness,
				setSelectedBusiness,
				reqBusiness,
				loading,
			}}
		>
			{children}
		</Context.Provider>
	)
}

export const Business = {
	Context,
	Provider,
}

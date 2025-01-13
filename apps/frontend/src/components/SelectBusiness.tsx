import { Search, X } from 'lucide-react'
import { Modal } from './Modal'

interface SelectBusinessProps {
	businesses: Business[] | null
	setShowBusinessSelector: React.Dispatch<React.SetStateAction<boolean>>
	searchTerm: string
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>
	selectedBusiness: Business | null
	setSelectedBusiness: React.Dispatch<React.SetStateAction<Business | null>>
}

export const SelectBusiness: React.FC<SelectBusinessProps> = ({
	businesses,
	setShowBusinessSelector,
	searchTerm,
	setSearchTerm,
	selectedBusiness,
	setSelectedBusiness,
}): React.ReactNode => {
	const filteredBusinesses = businesses?.filter((business) =>
		business.name.toLowerCase().includes(searchTerm.toLowerCase())
	)
	return (
		<Modal>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">Select Store</h2>
				<button type="button" onClick={() => setShowBusinessSelector(false)}>
					<X className="h-6 w-6 text-red-500 hover:text-red-700" />
				</button>
			</div>

			<div className="relative mb-4">
				<input
					type="text"
					placeholder="Search stores..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-black"
				/>
				<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
			</div>

			<div className="space-y-2 max-h-60 overflow-y-auto">
				{filteredBusinesses?.map((business) => (
					<button
						type="button"
						key={business.id}
						onClick={() => {
							setSelectedBusiness(business)
							setShowBusinessSelector(false)
						}}
						className={`w-full text-left p-3 rounded-md hover:bg-gray-50 ${
							selectedBusiness?.id === business.id ? 'bg-gray-50' : ''
						}`}
					>
						<div className="font-medium">{business.name}</div>
					</button>
				))}
			</div>
		</Modal>
	)
}

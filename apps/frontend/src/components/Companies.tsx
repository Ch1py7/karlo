import { BusinessesService } from '@/services/business'
import { getRequest } from '@/services/requests'
import { AlertCircle, Building, Check, Plus, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { NewCompany } from './NewCompany'

export const Companies: React.FC = (): React.ReactNode => {
	const [showNewCompany, setShowNewCompany] = useState(false)
	const [businesses, setBusinesses] = useState<Business[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [alert, setAlert] = useState({ type: 0, theme: '', msg: '' })

	const getBusiness = useCallback(async () => {
		const { data, status } = await getRequest<Business[]>(
			BusinessesService.getBusinesses(searchTerm)
		)

		if (status === 200) setBusinesses(data)
	}, [searchTerm])

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setSearchTerm(value)
	}

	useEffect(() => {
		getBusiness()
	}, [getBusiness])

	return (
		<>
			{alert.type !== 0 && (
				<div
					className={`fixed top-8 right-4 left-4 mx-auto max-w-md ${alert.theme}  border  rounded-lg p-4 shadow-lg z-50`}
				>
					<div className="flex items-center">
						{alert.type === 1 && <Check className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />}
						{alert.type === 2 && (
							<AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
						)}
						<p className="text-sm text-black">{alert.msg}</p>
					</div>
				</div>
			)}
			{showNewCompany && (
				<NewCompany
					getBusiness={getBusiness}
					setAlert={setAlert}
					setShowNewCompany={setShowNewCompany}
				/>
			)}
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold">Companies</h1>
					<button
						type="button"
						onClick={() => setShowNewCompany(true)}
						className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
					>
						<Plus className="h-5 w-5" />
						<span>Add Company</span>
					</button>
				</div>
				<div className="flex space-x-4 items-center">
					<div className="relative">
						<input
							type="text"
							placeholder="Search company..."
							onInput={onInput}
							className="pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-black"
						/>
						<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{businesses.map((business) => (
						<div key={business.id} className="bg-white p-6 rounded-lg shadow-sm">
							<div className="flex items-center space-x-4">
								<Building />
								<div className="truncate w-full">
									<h3 className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
										{business.name}
									</h3>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

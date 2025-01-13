import { getRequest } from '@/services/requests'
import { UsersService } from '@/services/users'
import type { RootState } from '@/store/store'
import { Mail, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export const Customers: React.FC = (): React.ReactNode => {
	const [users, setUsers] = useState<GetUser[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const { token } = useSelector((state: RootState) => state.session)

	const getUsers = useCallback(async () => {
		if (!token) return
		const { data, status } = await getRequest<User[]>(UsersService.getUsers(searchTerm), token)

		if (status === 200) setUsers(data)
	}, [searchTerm, token])

	const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target
		setSearchTerm(value)
	}

	useEffect(() => {
		getUsers()
	}, [getUsers])

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Customers</h1>
				<div className="flex space-x-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search customers..."
							onInput={onInput}
							className="pl-10 pr-4 py-2 border rounded-lg focus:ring-1 focus:ring-black"
						/>
						<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{users.map((customer) => (
					<div key={customer.id} className="bg-white p-6 rounded-lg shadow-sm">
						<div className="flex items-center space-x-4 mb-4">
							<div className="truncate w-full">
								<h3 className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
									{customer.name}
								</h3>
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center text-gray-600 truncate w-full">
								<Mail className="h-4 w-4 mr-2" />
								<span className="text-sm text-ellipsis overflow-hidden whitespace-nowrap">
									{customer.email}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

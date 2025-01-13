import { Mail, MapPin, Phone } from 'lucide-react'
import type React from 'react'

export const Footer: React.FC = (): React.ReactNode => {
	return (
		<footer className="bg-white border-t">
			<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
						<div className="mt-4 space-y-2">
							<p className="flex items-center gap-2">
								<Mail className="h-4 w-4" /> info@minimalist.com
							</p>
							<p className="flex items-center gap-2">
								<Phone className="h-4 w-4" /> +1 (555) 123-4567
							</p>
							<p className="flex items-center gap-2">
								<MapPin className="h-4 w-4" /> 123 Fashion St, NY
							</p>
						</div>
					</div>
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
						<div className="mt-4 space-y-2">
							<p>Privacy Policy</p>
							<p>Terms of Service</p>
							<p>Return Policy</p>
						</div>
					</div>
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider">Newsletter</h3>
						<div className="mt-4">
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full px-3 py-2 border rounded-md"
							/>
							<button
								type="button"
								className="mt-2 w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
							>
								Subscribe
							</button>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

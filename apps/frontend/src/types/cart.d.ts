interface CartItem {
	id: string
	name: string
	price: number
	quantity: number
}

interface CartState {
	cart: CartItem[]
	totals: {
		totalOrder: number
		totalProducts: number
	}
}
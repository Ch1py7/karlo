import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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

const cartStorageName = 'CartStorageData'

const getSession = () => {
	const jwt = localStorage.getItem('token')
	if (jwt) {
		const payload = jwt.split('.')[1]
		const { sub, role_id, is_validated } = JSON.parse(atob(payload))

		return { sub, role_id, is_validated }
	}
}

const getCart = (): Cart[] => {
	const rawCart = localStorage.getItem(cartStorageName) || ''
	if (!rawCart || rawCart === '') {
		return []
	}

	const cart = JSON.parse(rawCart) as CartByUserId
	return cart[getSession()?.sub]
}

const initialState: CartState = {
	cart: getCart() || [],
	totals: {
		totalOrder: 0,
		totalProducts: 0,
	},
}

const setCartStorage = (cart: Cart[]) => {
	if (!getSession()) return
	localStorage.setItem(cartStorageName, JSON.stringify({ [getSession()?.sub]: cart }))
}

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		createCart: (state) => {
			state.cart = []
			if (getSession()?.sub) {
				localStorage.setItem(cartStorageName, JSON.stringify({ [getSession()?.sub]: state.cart }))
			}
		},
		addProduct: (state, action: PayloadAction<Cart>) => {
			const product = action.payload
			const oldCart = getCart()
			const existingProduct = oldCart.find((item) => item.id === product.id)

			if (existingProduct) {
				const productToAdd = oldCart.map((p) => {
					if (p.id === product.id) {
						return { ...p, quantity: p.quantity + 1 }
					}
					return p
				})
				setCartStorage([...productToAdd])
				state.cart = [...productToAdd]
			} else {
				setCartStorage([...oldCart, { ...product, quantity: 1 }])
				state.cart = [...oldCart, { ...product, quantity: 1 }]
			}
		},
		restProduct: (state, action: PayloadAction<Cart>) => {
			const product = action.payload
			const oldCart = getCart()
			const existingProduct = oldCart.find((item) => item.id === product.id)

			if (existingProduct) {
				const productToRest = oldCart.map((p) => {
					if (p.id === product.id) {
						if (p.quantity > 1) return { ...p, quantity: p.quantity - 1 }
					}
					return p
				})

				setCartStorage([...productToRest])
				state.cart = [...productToRest]
			}
		},
		removeProduct: (state, action: PayloadAction<string>) => {
			const productname = action.payload
			const cart = getCart()
			const productToDelete = cart.findIndex((e) => e.name === productname)
			delete cart[productToDelete]
			const newCart: Cart[] = cart.filter((_, index) => index !== productToDelete)

			setCartStorage(newCart)
			state.cart = newCart
		},
		manageTotals: (state, action: PayloadAction<Cart[]>) => {
			const cart = action.payload
			const { newTotalProducts, newTotalOrder } = cart.reduce(
				(totals, product) => {
					totals.newTotalProducts += product.quantity
					totals.newTotalOrder += product.price * product.quantity
					return totals
				},
				{ newTotalProducts: 0, newTotalOrder: 0 }
			)

			state.totals = {
				totalOrder: newTotalOrder,
				totalProducts: newTotalProducts,
			}
		},
		cleanCart: (state) => {
			state.cart = []
			setCartStorage([])
		},
	},
})

export const { createCart, addProduct, cleanCart, restProduct, removeProduct, manageTotals } =
	cartSlice.actions

export default cartSlice.reducer

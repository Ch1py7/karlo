import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import sessionReducer from './sessionSlice'

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		session: sessionReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

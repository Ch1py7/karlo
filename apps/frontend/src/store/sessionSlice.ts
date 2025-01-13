import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface SessionState extends Token {
	token: string
}

const initialState: SessionState = {
	token: '',
	email: '',
	id: '',
	is_validated: false,
	name: '',
	role_id: 0,
}

const setUserToken = (token: string) => {
	localStorage.setItem('token', token)
}

const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload
			setUserToken(action.payload)
		},
		setSession: (state, action: PayloadAction<Token>) => {
			state.email = action.payload.email
			state.id = action.payload.id
			state.is_validated = action.payload.is_validated
			state.name = action.payload.name
			state.role_id = action.payload.role_id
		},
	},
})

export const { setToken, setSession } = sessionSlice.actions

export default sessionSlice.reducer

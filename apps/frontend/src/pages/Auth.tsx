import { useState } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { Login } from './Login'
import { Register } from './Register'

export const Auth: React.FC = (): React.ReactNode => {
	const [login, setLogin] = useState<SendLogin>({ email: '', password: '' })
	const [register, setRegister] = useState<SendRegister>({
		id: crypto.randomUUID(),
		email: '',
		password: '',
		name: '',
		role_id: 2,
	})
	return (
		<>
			<Routes>
				<Route path="login" element={<Login login={login} setLogin={setLogin} />} />
				<Route
					path="register"
					element={<Register register={register} setRegister={setRegister} />}
				/>
			</Routes>
			<Outlet />
		</>
	)
}

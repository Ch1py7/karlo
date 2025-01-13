import type express from 'express'
import { verifyJwt } from '../service/jwt'

export const validateEmail = (email: string) => {
	const regex =
		// biome-ignore lint/performance/useTopLevelRegex: <explanation>
		// biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

	return !regex.test(email)
}

export const validateStatus = (status: string) => {
	const keywordMapping: Record<string, number> = {
		pending: 1,
		paid: 2,
		returned: 3,
		cancelled: 4,
	}

	return Object.entries(keywordMapping).find(([keyword]) =>
		keyword.includes(status.toLowerCase())
	)?.[1]
}

export const isTokenValid = (exp: number) => {
	return Date.now() > exp * 1000
}

export const authenticate = (allowedRoles?: number[]) => {
	return (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const token = req.headers.authorization?.split(' ')[1] ?? ''
		try {
			const payload = verifyJwt<{
				sub: number
				exp: number
				role_id: 1 | 2
				is_validated: boolean
			}>(token)

			if (Date.now() > payload.exp * 1000) {
				return res.status(401).json({ errors: ['token expired'] })
			}

			if (!payload.is_validated) {
				return res
					.status(401)
					.json({ errors: ['Please validate your account before performing this action'] })
			}

			if (allowedRoles && !allowedRoles.includes(payload.role_id)) {
				return res
					.status(403)
					.json({ errors: ['You do not have permission to access this resource'] })
			}

			req.user = payload

			next()
		} catch (e) {
			res.status(400).json({ errors: [(e as Error).message] })
		}
	}
}


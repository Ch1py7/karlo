// src/types/express.d.ts
import * as express from 'express'

declare global {
	namespace Express {
		interface Request {
			user?: {
				sub: number
				exp: number
				role_id: 1 | 2
				is_validated: boolean
			}
		}
	}
}

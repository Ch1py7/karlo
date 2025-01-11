import jwt, { type JwtPayload } from 'jsonwebtoken'

const EXPIRATION = 60 * 60 * 24 * 30
const SECRET = process.env.JWT_SECRET!

export const verifyJwt = <T extends object>(token: string) => {
	return jwt.verify(token, SECRET) as T & JwtPayload
}

export const signJwt = <T extends object>(payload: T) => {
	return jwt.sign(payload, SECRET, {
		expiresIn: EXPIRATION,
	})
}
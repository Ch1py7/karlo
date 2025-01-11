import { verifyJwt } from '@/functions/service/jwt'
import { cancel } from '@/functions/users/delete-user'
import { get } from '@/functions/users/get-user'
import { update } from '@/functions/users/update-user'
import { authenticate, isTokenValid } from '@/functions/utils/validators'
import express from 'express'
import { body, query, validationResult } from 'express-validator'

const router = express.Router()

router.get('/users', query('search'), authenticate, async (req: express.Request, res: express.Response) => {
	try {
		const { search } = req.query
		const users = await get(search as string)

		res.status(200).send(users)
	} catch (e) {
		res.status(400).json({ errors: [(e as Error).message] })
	}
})

router.delete(
	'/users/delete',
	query('id')
		.notEmpty()
		.withMessage('id is required')
		.bail()
		.isString()
		.withMessage('id should be a string')
		.bail(),
  authenticate,
	async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				const error = errors.array().map((e) => e.msg)
				return res.status(400).json(error)
			}

			const { id } = req.query

			await cancel(id as string)

			res.status(200).send()
		} catch (e) {
			res.status(400).json({ errors: [(e as Error).message] })
		}
	}
)

router.put(
	'/users/update',
	[
		body('id')
			.notEmpty()
			.withMessage('id is required')
			.bail()
			.isNumeric()
			.withMessage('id should be a number')
			.bail(),
		body('name')
			.notEmpty()
			.withMessage("name can't be empty")
			.bail()
			.isString()
			.withMessage('name should be a string')
			.bail(),
		body('role_id')
			.notEmpty()
			.withMessage("role can't be empty")
			.bail()
			.isIn([1, 2])
			.withMessage('role must be 1 (business) or 2 (client)')
			.bail(),
	],
  authenticate,
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { name, id, role_id } = req.body

		try {
			await update({ name, id, role_id })

			res.status(200).send()
		} catch (e) {
			res.status(400).json({ errors: [(e as Error).message] })
		}
	}
)

export { router }

import { cancel } from '@/functions/users/delete-user'
import { get } from '@/functions/users/get-user'
import { token } from '@/functions/users/token-user'
import { update } from '@/functions/users/update-user'
import { authenticate } from '@/functions/utils/validators'
import express from 'express'
import { body, query, validationResult } from 'express-validator'

const router = express.Router()

router.get(
	'/users',
	query('search'),
	authenticate,
	async (req: express.Request, res: express.Response) => {
		try {
			const { search } = req.query
			const users = await get(search as string)

			res.status(200).send(users)
		} catch (e) {
			res.status(400).json({ errors: [(e as Error).message] })
		}
	}
)

router.get(
	'/users/token',
	query('id')
		.notEmpty()
		.withMessage("id can't be empty")
		.bail()
		.isString()
		.withMessage('id should be a string')
		.bail()
		.isUUID(4)
		.withMessage('id should be a valid uuid')
		.bail(),
	authenticate,
	async (req: express.Request, res: express.Response) => {
		try {
			const { id } = req.query
			const users = await token(id as string)

			res.status(200).send(users)
		} catch (e) {
			res.status(400).json({ errors: [(e as Error).message] })
		}
	}
)

router.delete(
	'/users/delete',
	body('id')
		.notEmpty()
		.withMessage("id can't be empty")
		.bail()
		.isString()
		.withMessage('id should be a string')
		.bail()
		.isUUID(4)
		.withMessage('id should be a valid uuid')
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
			.withMessage("id can't be empty")
			.bail()
			.isString()
			.withMessage('id should be a string')
			.bail()
			.isUUID(4)
			.withMessage('id should be a valid uuid')
			.bail(),
		body('name')
			.notEmpty()
			.withMessage("name can't be empty")
			.bail()
			.isString()
			.withMessage('name should be a string')
			.bail()
			.isLength({ min: 3 })
			.withMessage('name should be at least 3 characters long')
			.bail(),
	],
	authenticate,
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { name, id } = req.body

		try {
			await update({ name, id })

			res.status(200).send()
		} catch (e) {
			res.status(400).json({ errors: [(e as Error).message] })
		}
	}
)

export { router }

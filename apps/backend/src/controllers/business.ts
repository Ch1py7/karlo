import { create } from '@/functions/business/create-business'
import { cancel } from '@/functions/business/delete-business'
import { get } from '@/functions/business/get-business'
import { update } from '@/functions/business/update-business'
import { authenticate } from '@/functions/utils/validators'
import express from 'express'
import { body, query, validationResult } from 'express-validator'

const router = express.Router()

router.get(
	'/business',
	query('search'),
	async (req: express.Request, res: express.Response) => {
		try {
			const { search } = req.query
			const business = await get(search as string)

			res.status(200).send(business)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.delete(
	'/business/delete',
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
	authenticate([1]),
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
			res.status(400).send([(e as Error).message])
		}
	}
)

router.put(
	'/business/update',
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
			.bail(),
	],
	authenticate([1]),
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
			res.status(400).send([(e as Error).message])
		}
	}
)

router.post(
	'/business/create',
	[
		body('name')
			.notEmpty()
			.withMessage("name can't be empty")
			.bail()
			.isString()
			.withMessage('name should be a string')
			.bail()
			.isLength({ min: 3, max: 20 })
			.withMessage('name must be between 3 and 20 characters')
			.bail(),
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
	],
	authenticate([1]),
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { name, id } = req.body

		try {
			const business = await create({ id, name })

			res.status(201).send(business)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

export { router }

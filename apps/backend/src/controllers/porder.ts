import { create } from '@/functions/porder/create-porder'
import { cancel } from '@/functions/porder/delete-porder'
import { get } from '@/functions/porder/get-porder'
import { update } from '@/functions/porder/update-porder'
import { authenticate } from '@/functions/utils/validators'
import express from 'express'
import { body, query, validationResult } from 'express-validator'

const router = express.Router()

router.get(
	'/porder',
	query('search'),
	body('user_id')
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
			const { search } = req.query as { search: string }
			const { user_id } = req.body
			const porder = await get({ user_id, search })

			res.status(200).send(porder)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.delete(
	'/porder/delete',
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
	'/porder/update',
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
		body('status')
			.notEmpty()
			.withMessage("role can't be empty")
			.bail()
			.isIn([1, 2, 3, 4, 5, 7, 8])
			.withMessage('role must be between 1 and 8')
			.bail(),
	],
	authenticate,
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { status, id } = req.body

		try {
			await update({ status, id })

			res.status(200).send()
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.post(
	'/porder/create',
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
		body('business_id')
			.notEmpty()
			.withMessage("business id can't be empty")
			.bail()
			.isString()
			.withMessage('business id should be a string')
			.bail()
			.isUUID(4)
			.withMessage('business id should be a valid uuid')
			.bail(),
		body('user_id')
			.notEmpty()
			.withMessage("user id can't be empty")
			.bail()
			.isString()
			.withMessage('user id should be a string')
			.bail()
			.isUUID(4)
			.withMessage('user id should be a valid uuid')
			.bail(),
		body('status')
			.notEmpty()
			.withMessage("role can't be empty")
			.bail()
			.isIn([1, 2, 3, 4, 5, 7, 8])
			.withMessage('role must be between 1 and 8')
			.bail(),
		body('total')
			.notEmpty()
			.withMessage("total can't be empty")
			.bail()
			.isFloat({ min: 0 })
			.withMessage('total should be a positive number')
			.bail(),
		body('subtotal')
			.notEmpty()
			.withMessage("subtotal can't be empty")
			.bail()
			.isFloat({ min: 0 })
			.withMessage('subtotal should be a positive number')
			.bail(),
		body('tax')
			.notEmpty()
			.withMessage("tax can't be empty")
			.bail()
			.isFloat({ min: 0 })
			.withMessage('tax should be a positive number')
			.bail(),
		body('products')
			.notEmpty()
			.withMessage("products can't be empty")
			.bail()
			.isString()
			.withMessage('products should be a string')
			.bail(),
	],
	authenticate,
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { id, business_id, user_id, status, total, subtotal, tax, products } = req.body

		try {
			const porder = await create({
				id,
				business_id,
				user_id,
				status,
				total,
				subtotal,
				tax,
				products,
			})

			res.status(201).send(porder)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

export { router }

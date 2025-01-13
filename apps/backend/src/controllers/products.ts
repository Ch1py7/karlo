import { create } from '@/functions/products/create-product'
import { cancel } from '@/functions/products/delete-product'
import { get } from '@/functions/products/get-product'
import { update } from '@/functions/products/update-product'
import { authenticate } from '@/functions/utils/validators'
import express from 'express'
import { body, query, validationResult } from 'express-validator'

const router = express.Router()

router.get(
	'/products',
	query('search'),
	query('business_id')
  .notEmpty()
  .withMessage("business id can't be empty")
  .bail()
  .isString()
  .withMessage('business id should be a string')
  .bail()
  .isUUID(4)
  .withMessage('business id should be a valid uuid')
  .bail(),
	async (req: express.Request, res: express.Response) => {
		try {
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				const error = errors.array().map((e) => e.msg)
				return res.status(400).json(error)
			}

			const { search, business_id } = req.query as { search: string, business_id: string }
			const product = await get({ business_id, search })

			res.status(200).send(product)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.delete(
	'/products/delete',
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
	'/products/update',
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
		body('price')
			.notEmpty()
			.withMessage("price can't be empty")
			.bail()
			.isNumeric()
			.withMessage('price should be a number')
			.bail()
			.isFloat({ min: 0 })
			.withMessage('price should be a positive number')
			.bail(),
		body('stock')
			.notEmpty()
			.withMessage("stock can't be empty")
			.bail()
			.isNumeric()
			.withMessage('stock should be a number')
			.bail()
			.isInt({ min: 1 })
			.withMessage('stock should be a positive integer and greater than 0')
			.bail(),
	],
	authenticate,
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { name, id, price, stock } = req.body

		try {
			await update({ name, id, price, stock })

			res.status(200).send()
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.post(
	'/products/create',
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
		body('price')
			.notEmpty()
			.withMessage("price can't be empty")
			.bail()
			.isNumeric()
			.withMessage('price should be a number')
			.bail()
			.isFloat({ min: 0 })
			.withMessage('price should be a positive number')
			.bail(),
		body('stock')
			.notEmpty()
			.withMessage("stock can't be empty")
			.bail()
			.isNumeric()
			.withMessage('stock should be a number')
			.bail()
			.isInt({ min: 1 })
			.withMessage('stock should be a positive integer and greater than 0')
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
	],
	authenticate,
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { name, id, price, stock, business_id } = req.body

		try {
			const product = await create({ name, id, price, stock, business_id })

			res.status(201).send(product)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

export { router }

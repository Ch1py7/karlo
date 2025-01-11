import { login } from '@/functions/auth/login'
import { validate } from '@/functions/auth/validate'
import { create } from '@/functions/users/create-user'
import { validateEmail } from '@/functions/utils/validators'
import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

router.post(
	'/auth/register',
	[
		body('name')
			.notEmpty()
			.withMessage("name can't be empty")
			.bail()
			.isString()
			.withMessage('name should be a string')
			.bail(),
		body('password')
			.notEmpty()
			.withMessage("password can't be empty")
			.bail()
			.isString()
			.withMessage('password should be a string')
			.bail()
			.isLength({ min: 8 })
			.withMessage('password should be at least 8 characters long')
			.bail(),
		body('email')
			.notEmpty()
			.withMessage("email can't be empty")
			.bail()
			.isString()
			.withMessage('email should be a string')
			.bail()
			.custom(async (value) => {
				if (validateEmail(value)) throw new Error('incorrect email')
			})
			.bail(),
		body('role_id')
			.notEmpty()
			.withMessage("role can't be empty")
			.bail()
			.isIn([1, 2])
			.withMessage('role must be 1 (business) or 2 (client)')
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
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { email, name, password, role_id, id } = req.body

		try {
			const user = await create({ email, name, password, role_id, id })

			res.status(201).send(user)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.post(
	'/auth/login',
	[
		body('password')
			.notEmpty()
			.withMessage("password can't be empty")
			.bail()
			.isString()
			.withMessage('password should be a string')
			.bail(),
		body('email')
			.notEmpty()
			.withMessage("email can't be empty")
			.bail()
			.isString()
			.withMessage('email should be a string')
			.bail()
			.custom(async (value) => {
				if (validateEmail(value)) throw new Error('incorrect email')
			})
			.bail(),
	],
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { email, password } = req.body

		try {
			const user = await login({ email, password })

			res.status(200).send(user)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.put(
	'/auth/validate',
	[
		body('code')
			.notEmpty()
			.withMessage("code can't be empty")
			.bail()
			.isString()
			.withMessage('code should be a string')
			.bail(),
		body('email')
			.notEmpty()
			.withMessage("email can't be empty")
			.bail()
			.isString()
			.withMessage('email should be a string')
			.bail()
			.custom(async (value) => {
				if (validateEmail(value)) throw new Error('incorrect email')
			})
			.bail(),
	],
	async (req: express.Request, res: express.Response) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const error = errors.array().map((e) => e.msg)
			return res.status(400).json(error)
		}

		const { email, code } = req.body

		try {
			await validate({ email, code })

			res.status(200).send('User validated')
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

export { router }

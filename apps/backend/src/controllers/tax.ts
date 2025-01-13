import { get } from '@/functions/tax/get-tax'
import { update } from '@/functions/tax/update-tax'
import { authenticate } from '@/functions/utils/validators'
import express from 'express'
import { body } from 'express-validator'

const router = express.Router()

router.put(
	'/tax/update',
	body('tax')
		.notEmpty()
		.withMessage("tax can't be empty")
		.bail()
		.isNumeric()
		.withMessage('tax should be a number')
		.bail()
		.isInt({ min: 0, max: 100 })
		.withMessage('tax should be a positive integer, and less than 100')
		.bail(),
	authenticate([1]),
	async (req: express.Request, res: express.Response) => {
		try {
			const { tax } = req.body
			const business = await update({ tax })

			res.status(200).send(business)
		} catch (e) {
			res.status(400).send([(e as Error).message])
		}
	}
)

router.get('/tax', authenticate, async (req: express.Request, res: express.Response) => {
	try {
		const tax = await get()

		res.status(200).send(tax)
	} catch (e) {
		res.status(400).send([(e as Error).message])
	}
})

export { router }

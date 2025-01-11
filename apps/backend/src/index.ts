import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
import express from 'express'
import { sequelize } from './postgres/config/client'

const main = async () => {
  if (process.env.NODE_ENV === 'production') {
    await import('module-alias/register')
  }
  const { router: auth } = await import('@/controllers/auth')
  const { router: users } = await import('@/controllers/users')
  const { router: business } = await import('@/controllers/business')
  const { router: products } = await import('@/controllers/products')
  const { router: porder } = await import('@/controllers/porder')

	const port = process.env.PORT || 8000
	const app = express()

	app.use(cors())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))


	app.listen(port, () => {
		console.log(`Server running on port ${port}`)
	})

  sequelize
    .sync()
    .then(() => {
      console.log('Connection has been established successfully.')
      app.use('/api', auth)
      app.use('/api', users)
      app.use('/api', business)
      app.use('/api', products)
      app.use('/api', porder)
    })
    .catch((e) => {
      console.error('Unable to connect to the database:', e)
    })

	app.get('/', (req, res) => {
		const url = `${req.protocol}://${req.get('host')}`
		console.log(`Server running on URL: ${url}`)
		res.send(`Server running on URL: ${url}`)
	})
}

main()
import { Sequelize } from 'sequelize'
import { config } from './config'

export const sequelize = new Sequelize(config.postgres.url, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
})

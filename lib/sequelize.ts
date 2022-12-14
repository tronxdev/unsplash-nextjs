import * as pg from 'pg';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
    dialectModule: pg,
  },
);

export async function connect() {
  try {
    console.log('database', process.env.PG_DATABASE);
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

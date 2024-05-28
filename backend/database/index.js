import 'dotenv/config'
import PG from 'pg';
const Pool = PG.Pool;
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT

export const pool = new Pool({
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	host: DB_HOST,
	port: DB_PORT,
});

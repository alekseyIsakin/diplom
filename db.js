const { Pool } = require('pg')
require('dotenv').config();
const pool = new Pool({
	user: process.env.PGUSER,
	database: process.env.PGDB,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
	host: process.env.PGHOST,
})

module.exports = { pool };



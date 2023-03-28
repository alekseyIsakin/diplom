const { Pool } = require('pg')
const pool = new Pool({
	user: 'psql_user',
	database: 'users',
	password: 'passw',
	port: 5432,
	host: 'localhost',
})

module.exports = { pool };



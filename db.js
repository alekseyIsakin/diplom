const { Pool } = require('pg')
const pool = new Pool({
	user: 'psql_user',
	database: 'users',
	password: 'passw',
	port: 5432,
	host: '192.168.3.40',
})

module.exports = { pool };



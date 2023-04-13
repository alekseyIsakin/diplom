'use strict'

require('dotenv').config();
const { logger } = require('./logger');

const { Pool } = require('pg')
const pool = new Pool({
	user: process.env.PGUSER,
	database: process.env.PGDB,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
	host: process.env.PGHOST,
})

const stored_data = {
	days: [],
	times: [],
	groups: [],
}

const load_common_date_time = async (callback) => {
	try {
		const res_query = await pool.query(
			"select id, title from day_of_week;"
		);
		stored_data.days = res_query.rows
	} catch (error) {
		logger.error(error);
	}
	try {
		const res_query = await pool.query(
			"select id, from_as_minuts, duration_as_minuts from shedule_time order by from_as_minuts;"
		);
		stored_data.times = res_query.rows
	} catch (error) {
		logger.error(error);
	}
	try {
		const res_query = await pool.query(
			"select id, title from students_group where not id = 0; "
		);
		stored_data.groups = res_query.rows
	} catch (error) {
		logger.error(error);
		callback(error)
	}
	callback(null)
	logger.info('db initialized')
}

const get_certain_classes = async (day_id, time_id, up, callback) => {
	try {
		const res_query = await pool.query(
			"select group_id, from_as_minuts, duration from get_class_shedule where day_id = $1 and time_id = $2 and up = $3;", [
			day_id, time_id, Boolean(up)
		]
		);
		callback(null, res_query.rows)
	} catch (error) {
		logger.error(error);
		callback(error)
	}
}

const upload_new_tokens = async (tokens, callback) => {
	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		await client.query(`DELETE FROM tokens`)
		const query_params = []
		const query_args = []

		for (let i = 0; i< tokens.length; i++){
			query_params.push(`($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
			query_args.push(tokens[i].channel_name)
			query_args.push(tokens[i].token)
			query_args.push(tokens[i].group_id)
		}

		const res_query = await client.query(
			`INSERT INTO tokens (channel_name, token, group_id) VALUES ` + query_params.join(','),
			query_args
		);
		await client.query('COMMIT')
		if (callback !== null) callback(null, res_query.rows)
	} catch (error) {
		await client.query('ROLLBACK')
		logger.error(error);
		if (callback !== null) callback(null, res_query.rows)
	}
}

module.exports.pool = pool;
module.exports.init_db = load_common_date_time;
module.exports.stored_data = stored_data;
module.exports.get_classes = get_certain_classes;
module.exports.upload_new_tokens = upload_new_tokens;




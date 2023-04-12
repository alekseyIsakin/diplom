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
		console.error(error);
		callback(error)
	}
}

module.exports.pool = pool;
module.exports.init_db = load_common_date_time;
module.exports.stored_data = stored_data;
module.exports.get_classes = get_certain_classes;




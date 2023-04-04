'use strict'

require('dotenv').config();

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
	rasp: [],
	groups: [],
}

const init_db = async (callback) => {
	try {
		const res_query = await pool.query(
			"select title from day_of_week;"
		);
		stored_data.days = res_query.rows
	} catch (error) {
		console.error(error);
	}
	try {
		const res_query = await pool.query(
			"select id, from_as_minuts, duration_as_minuts from shedule_time;"
		);
		stored_data.times = res_query.rows
	} catch (error) {
		console.error(error);
	}
	try {
		const res_query = await pool.query(
			"select title from students_group where not id = 0; "
		);
		stored_data.groups = res_query.rows
	} catch (error) {
		console.error(error);
		callback(error)
	}
	callback(null)
	console.log('db initialized')
}

const get_certain_classes = async (day_id, time_id, up, callback) => {
	try {
		const res_query = await pool.query(
			"select group_id, class_id, duration from get_class_shedule where day_id = $1 and time_id = $2 and up = $3;", [
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
module.exports.init_db = init_db;
module.exports.stored_data = stored_data;
module.exports.get_classes = get_certain_classes;




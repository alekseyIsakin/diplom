'use strict'

require('dotenv').config();
const logger = require('./logger')(__filename);

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
	facultets: [],
}

// Must be called first after the server is started
const load_common_date_time = async (callback) => {
	try {
		const res_query = await pool.query(
			"select id, title from day_of_week;"
		);
		logger.verbose(`day_of_week info loaded [ ${res_query.rowCount} ]`)
		stored_data.days = res_query.rows
		// stored_data.days.forEach( d_id => {d_id.id = Number(d_id.id - 1); return d_id})
	} catch (error) {
		logger._error(error);
	}
	try {
		const res_query = await pool.query(
			"select id, from_as_minuts, duration_as_minuts from shedule_time order by from_as_minuts;"
		);
		logger.verbose(`time info loaded [ ${res_query.rowCount} ]`)
		stored_data.times = res_query.rows
	} catch (error) {
		logger._error(error);
	}
	try {
		const res_query = await pool.query(
			`select 
				s.year, 
				s.id as g_id, 
				f.id as f_id, 
				s.title g_title, 
				f.title f_title 
				from students_group as s 
				left join facultets as f on f.id = s.facultet_id;`
		);
		for (let i = 0; i < res_query.rows.length; i++) {
			const group = res_query.rows[i]
			const f_id = group['f_id']
			if (!stored_data.facultets[f_id])
				stored_data.facultets[f_id] = {}
			if (!stored_data.facultets[f_id][group.year])
				stored_data.facultets[f_id][group.year] = {}
			stored_data.facultets[f_id][group.year][group.g_id] = {
				'title': group.g_title
			}

			stored_data.facultets[f_id]
		}
		logger.verbose(`all groups info loaded [ ${res_query.rowCount} ]`)
	} catch (error) {
		logger._error(error);
		callback(error)
	}
	callback(null)
	logger.info('db initialized')

}

const get_certain_classes = async (day_id, time_id, up, callback) => {
	let res_query
	let _error
	try {
		res_query = await pool.query(
			"select class_id, group_id, from_as_minuts, duration from get_class_shedule where day_id = $1 and time_id = $2 and up = $3;", [
			day_id, time_id, Boolean(up)
		]
		);
		logger.verbose(`selected [ ${res_query.rowCount} ] classes for day [ ${day_id} ], time [ ${time_id} ], up [ ${up} ]`)
	} catch (error) {
		_error = error
		logger._error(error);
	}
	callback(_error, res_query.rows)
}

const upload_new_tokens = async (tokens, callback) => {
	const client = await pool.connect()

	try {
		await client.query('BEGIN')
		await client.query(`DELETE FROM tokens`)
		await client.query('COMMIT')
	}
	catch {
		logger._error('drop tokens error: ' + error);
	}

	if (tokens.length == 0) {
		logger._info('no tokens provided')
		if (callback !== null) callback(null, null)
		return
	}

	try {
		const query_params = []
		const query_args = []

		for (let i = 0; i < tokens.length; i++) {
			query_params.push(`($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
			query_args.push(tokens[i].channel_name)
			query_args.push(tokens[i].token)
			query_args.push(tokens[i].group_id)
			query_args.push(tokens[i].class_id)
		}
		const res_query = await client.query(
			`INSERT INTO tokens (channel_name, token, group_id, class_id) VALUES ` + query_params.join(','),
			query_args
		);
		await client.query('COMMIT')
		if (callback !== null) callback(null, res_query.rowCount)
	} catch (error) {
		await client.query('ROLLBACK')
		logger._error('upload_new_tokens error: ' + error);
		if (callback !== null) callback(error, null)
	}
}

const get_token = async (group_id, callback) => {
	try {
		const res_query = await pool.query(
			`select 
				channel_name, 
				token, 
				title, 
				first_name as f_name, 
				second_name as s_name, 
				thrid_name as t_name 
			from tokens as t
				left join teacher_classes as tc on t.class_id=tc.id
				left join users as u on tc.teacher_id=u.id
				where t.group_id=$1;`,
			[group_id]
		);
		if (callback !== null) callback(null, res_query.rows)
	} catch (error) {
		logger._error(error, null);
	}
}

const load_table = async (facultet_id, year, callback) => {
	try {
		const res_query = await pool.query(
			`select * from get_class_shedule where facultet_id=$1 and group_year=$2;`, [
			facultet_id, year
		]
		);
		if (callback !== null) callback(null, res_query.rows, facultet_id, year)
	} catch (error) {
		logger._error(error, null);
	}
}


module.exports.pool = pool;
module.exports.init_db = load_common_date_time;
module.exports.stored_data = stored_data;
module.exports.get_classes = get_certain_classes;
module.exports.upload_new_tokens = upload_new_tokens;
module.exports.load_table = load_table;
module.exports.get_token = get_token;




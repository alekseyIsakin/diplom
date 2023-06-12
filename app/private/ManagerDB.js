'use strict'
require('dotenv').config();

const mysql = require("mysql2");
const { loggers } = require('winston');
const logger = require('./logger')(__filename);



const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	database: process.env.MYSQL_DB,
	password: process.env.MYSQL_SECRET,
	port: process.env.MYSQL_PORT
});
connection.connect(
	(err) => {
		if (err)
			logger._error(err.message);
		else
			logger._info("Подключение к серверу MySQL успешно установлено");
	});

const make_querry = (query, params, error) => {
	return connection
		.promise()
		.query(query, params)
		.then(
			(results) => {
				return { err: null, results: results[0] }
			})
		.catch((err) => {
			logger._error(`error when query:\n\t${err.message}]`, true);
			return { err: err, results: [] }
		})
}

const compare_password = (passw_hash, passw) => {
	return passw_hash == passw
}

class DataBase {
	static async check_user_password(error, success, user_nick, password) {
		logger._debug(`check passport of user [${user_nick}]`);
		const q = "SELECT id, nick, passw_hash as p, group_id from users left join student_group on users.id=student_id where nick=?;"
		const v = [user_nick]
		const res = make_querry(q, v)

		res.then((value) => {
			logger._debug(`check_passw [${JSON.stringify(value)}]`, true);
			if (value.results.length <= 0 || value.err) {
				logger._debug(`unknown user [${user_nick}]`);
				error(value.err)
				return
			}
			if (compare_password(value.results[0].p, password)) {
				const g_id = []
				value.results.every(v => g_id.push(v.group_id))
				success({
					id: value.results[0].id,
					nick: value.results[0].nick,
					group_id: g_id,
				})
				logger._debug(`passport is valid user:[${user_nick}]`);
			}
			else {
				logger._debug(`passport is invalid user:[${user_nick}]`);
				error(value.err)
			}
		})
	}
	static add_new_student(nick, f_name, t_name, s_name, password) { }
	static add_new_teacher(nick, f_name, t_name, s_name, password) { }
	static add_new_admin(nick, f_name, t_name, s_name, password) { }

	static get_students() { }
	static get_teachers() { }
	static get_admins() { }

	static change_role(id, new_role) { }

	static delete_user(id) { }

	static add_new_group(title) { }
	static delete_group(title) { }
	static get_groups(error, success) {
		const q = "SELECT id, group_title FROM get_groups;"
		const v = []
		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}

	static add_student_to_group(student_id, group_id) { }
	static remove_student_from_group(student_id, group_id) { }

	static add_new_class(teacher_id, title, group_id) { }
	static get_classes(error, success, class_title, teacher_id) {
		const q = "SELECT teacher_id, class_id, group_id, class_title, group_title FROM get_classes WHERE teacher_id=?" + (class_title === undefined ? ';' : ' and class_title like ?;')
		const v = [teacher_id, class_title]
		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}
	static get_registered_classes(error, success, from, to, group_id, teacher_id) {
		logger._info(`get registered classes for\n\t group:[${group_id}]; from:[${from}]; to[${to}]`)
		const q = "SELECT id, start, group_id, duration_minuts, freq_cron, week_cnt from get_registered_classes where start>=? and start<=? " +
			(group_id.length == 0 ? '' : 'and group_id in (' + (new Array(group_id.length).fill('?')).join() + ')') +
			(teacher_id === null ? '' : 'and teacher_id=? ')
		const v = [from, to]

		if (group_id !== null) 
			group_id.forEach(el => {v.push(el)}); 
		if (teacher_id !== null) v.push(teacher_id)

		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}
	static delete_class(id) { }

	static register_class(error, success, class_id, freq_cron, start, duration_minuts, week_cnt) {
		logger._info(`register class ${class_id} ${freq_cron} ${duration_minuts}`)
		const q = "CALL register_class(?,?,?,?,?);"
		const v = [class_id, freq_cron, start, duration_minuts, week_cnt]
		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}
	static delay_registered_class_on_week(error, success, class_id, start_utc, week_cnt) {
		const week = week_cnt * 7 * 24 * 60
		const q = "CALL delay_registered_class(?,?);"
		const v = [class_id, start_utc + week]
		logger._info(`update class delay ${class_id} on [${start_utc + week}]`)
		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}

	static clear_sessions(error, success) {
		logger._info(`clear saved sessions`, true)
		const q = "delete from sessions"
		const v = []
		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}
	static unregister_class(error, success, registered_class_id) {
		logger._info(`unregister_class ${registered_class_id}`, true)
		const q = "CALL unregister_class(?);"
		const v = [registered_class_id]
		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}

	static save_sesion(error, success, group_id, openvidu_session) {
		//DataBase.sessions.push({ group_id: group_id, openvidu_session: openvidu_session })
		const q = "CALL save_session(?,?);"
		const v = [group_id, openvidu_session]
		logger._info(`save sessions ${v}`, true)

		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}
	static get_session(group_id) { }
	static async delete_sesion(error, success, group_id) {
		const q = "select delete_session(?) as deleted;"
		const v = [group_id]
		logger._info(`close session for group ${JSON.stringify(group_id)}}`, true)

		make_querry(q, v)
			.then((value) => {
				if (value.err || value.results.length == 0)
					error(value.err)
				else
					success(value.results)
			})
	}
	static sessions = []

}
module.exports = { DataBase }
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
				logger._debug(`selected [${results[0].length}]`, true);
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
	static async check_user_password(error, success, user, password) {
		logger._debug(`check passport of user [${user}]`);
		const q = "SELECT nick, passw_hash as p from users where nick=?;"
		const v = [user]
		const res = make_querry(q, v)

		res.then((value) => {
			logger._debug(`check_passw [${JSON.stringify(value)}]`, true);
			if (value.results.length <= 0 || value.err) {
				logger._debug(`unknown user [${user}]`);
				error(value.err)
				return
			}
			if (compare_password(value.results[0].p, password)) {
				success()
				logger._debug(`passport is valid user:[${user}]`);
			}
			else {
				logger._debug(`passport is invalid user:[${user}]`);
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

	static add_student_to_group(student_id, group_id) { }
	static remove_student_from_group(student_id, group_id) { }

	static add_new_class(teacher_id, title, group_id) { }
	static get_classes(title, teacher_id) {
		return [
			{ id: 1, teacher_id: 1, title: "class 1 [t1:g1]", group_id: 1 },
			{ id: 2, teacher_id: 1, title: "class 2 [t1:g1]", group_id: 1 },
			{ id: 3, teacher_id: 1, title: "class 3 [t1:g2]", group_id: 2 },
			{ id: 4, teacher_id: 2, title: "class 3 [t2:g2]", group_id: 2 },
			{ id: 5, teacher_id: 3, title: "class 3 [t3:g1]", group_id: 1 },
		]
	}
	static get_registered_classes(error, success, group_id, teacher_id, from, to) {
		const q = "SELECT id, start, group_id, duration_minuts, freq_cron, once from get_registered_classes;"
		const v = []
		make_querry(q, v)
			.then((value) => {
				if (value.err)
					error(value.err)
				else
					success(value.results)
			})
	}
	static delete_class(id) { }

	static register_class(error, success, class_id, freq_cron, start, duration_minuts) { logger._info(`register class ${class_id} ${freq_cron} ${duration_minuts}`) }
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

	static save_sesion(group_id, openvidu_session) {
		DataBase.sessions.push({ group_id: group_id, openvidu_session: openvidu_session })
		logger._info(`saved sessions ${JSON.stringify(DataBase.sessions)}`, true)
	}
	static get_session(group_id) { }
	static async delete_sesion(group_id) {
		const session_ind = await DataBase.sessions.findIndex(s => s.group_id == group_id)
		const deleted = DataBase.sessions[session_ind]
		DataBase.sessions.splice(session_ind, 1)
		logger._info(`close session ${JSON.stringify(deleted)}\n\tsaved sessions: ${JSON.stringify(DataBase.sessions)}`, true)
		return deleted
	}
	static sessions = []

}
module.exports = { DataBase }
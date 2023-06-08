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


const compare_password = (passw_hash, passw) => {
	return passw_hash == passw
}

class DataBase {
	static check_user_password(user, password, error, success) {
		logger._debug(`check passport of user [${user}]`);
		const q = "SELECT nick, passw_hash as p from users where nick=?;"
		const v = [user]

		connection.promise().query(q, v)
			.then(res => {
				const results = res[0]
				if (results.length == 0) {
					logger._error("Ошибка: " + 'совпадений нет');
					error(err)
				}
				else {
					if (compare_password(results[0].p, password)) {
						logger._debug(`${results[0].nick} logged in`, true);
						success(results)
					}
					else {
						logger._debug(`${results[0].nick} wrong password`, true);
						error(err)
					}
				}
			})
			.catch(err => {
				error(err)
			});
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
	static get_registered_classes(group_id, teacher_id, from, to) {
		const r_classes = [
			{ id: 1, class_id: 1, freq_cron: "0 25 * * * *", start: 1686047400000, duration_min: 5 },
			{ id: 2, class_id: 2, freq_cron: "0 40 * * * *", start: 1686048300000, duration_min: 5 },
			{ id: 3, class_id: 3, freq_cron: "0 25 * * * *", start: 1686047400000, duration_min: 5 },
			{ id: 4, class_id: 4, freq_cron: "0 0/1 * * * *", start: 1686045600000, duration_min: 5 },
			{ id: 5, class_id: 5, freq_cron: "0/30 * * * * *", start: 1686045600000, duration_min: 5 },
		]
		logger._info(`selected [${r_classes.length}] classes`)
		return r_classes
	}
	static delete_class(id) { }

	static register_class(class_id, freq_cron, duration_min) { }
	static unregister_class(class_id) { }

	static open_sesion(group_id, openvidu_session) { }
	static get_session(group_id) { }
	static close_sesion(group_id) { }

}
module.exports = { DataBase }
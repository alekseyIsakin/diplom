'use strict'
require('dotenv').config();

const mysql = require("mysql2");
const { loggers } = require('winston');
const logger = require('./logger')(__filename);
const bcrypt = require('bcrypt')


const connection = mysql.createConnection({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	database: process.env.MYSQL_DB,
	password: process.env.MYSQL_SECRET,
	port: process.env.MYSQL_PORT
});


type ErrorHandler = (error?: Error) => void
type SuccesHandler<T> = (results: T) => void
type DBResponse = any[]

type RHandler<T> = { error?: Error, results: T[] }

type CheckPassportR = { id: number, nick: String, p: String, group_id: number }
type CheckPassportS = { id: number, nick: String, group_id: number[] }

type addNewClassR = { id: number, nick: String, p: String, group_id: number }

type GetGroupsR = { id: number, group_title: String }
type CheckRegisterCollision = { collisions: number }
type GetSessionsTokenR = {
	token: String,
	group_title: String,
	student_id: number
}

type GetRegisteredClassesParticial = {
	id: number,
	start: number,
	duration_minuts: number,
	group_id: number,
	freq_cron: String,
	week_cnt: number
}
type GetRegisteredClassesFull = {
	id: number,
	start: number,
	duration_minuts: number,
	group_id: number,
	week_cnt: number,
	class_title: string,
	group_title: string,
	first_name: string,
	second_name: string,
	thrid_name: string
}
type GetClassesR = {
	teacher_id: number,
	class_id: number,
	group_id: number,
	class_title: String,
	group_title: String
}
type RegisterNewClassesR = { id: number }

connection.connect();

function make_query<R>(query: String, params?: any[]): Promise<RHandler<R>> | undefined {
	return connection
		.promise()
		.query(query, params)
		.then(
			(results: DBResponse[]) => {
				let r: RHandler<R> = {
					error: undefined,
					results: results[0]
				}
				return r
			})
		.catch((error: Error) => {
			logger._error(`error when query:\n\t${error.message}]`, true);
			return { error: error, results: [] }
		})
}

const compare_password = async (passw_hash: String, passw: String): Promise<boolean> => {
	return await bcrypt.compare(passw, passw_hash)
}

export class DataBase {
	static is_connected = false;
	static async start_check_connect() {
		logger.warn(`first connection to mysql`);
		while (true) {
			logger.warn(`check connect `);
			connection.connect(async (err: any) => {
				if (err) {
					logger._error(`connection failed`);
					DataBase.is_connected = false
				} else {
					logger.warn(`still connect `);
					DataBase.is_connected = true
				}
			})
			if (DataBase.is_connected) break
			await new Promise(resolve => setTimeout(resolve, 5000))
		}
	}
	static async check_user_password(
		error: ErrorHandler,
		success: SuccesHandler<CheckPassportS>,
		user_nick: String,
		password: String) {
		logger._debug(`check passport of user [${user_nick}]`);
		const q = "SELECT id, nick, passw_hash as p, group_id from users left join student_group on users.id=student_id where nick=?;"
		const v = [user_nick]

		const p = make_query<CheckPassportR>(q, v)
		if (p !== undefined)
			p.then((value) => {
				logger._debug(`check_passw [${JSON.stringify(value)}]`, true);
				if (value.results.length <= 0 || value.error) {
					logger._debug(`unknown user [${user_nick}]`);
					error(value.error)
					return
				}
				compare_password(value.results[0].p, password)
					.then(r => {
						if (r) {
							const g_id: number[] = []
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
							error(value.error)
						}
					})
			})
	}
	// static add_new_student(nick, f_name, t_name, s_name, password) { }
	// static add_new_teacher(nick, f_name, t_name, s_name, password) { }
	// static add_new_admin(nick, f_name, t_name, s_name, password) { }

	// static get_students() { }
	// static get_teachers() { }
	// static get_admins() { }

	// static change_role(id, new_role) { }

	// static delete_user(id) { }

	// static add_new_group(title) { }
	// static delete_group(title) { }
	static get_groups(
		error: ErrorHandler,
		success: SuccesHandler<GetGroupsR[]>,
		group_ids?: number[]) {
		const q: String = `SELECT id, group_title FROM get_groups ${
			group_ids === undefined ?
			';' :
			'where id in (' + new Array(group_ids?.length).fill('?').join() + ')'
		}`
			

		const v: any[] = []
		if (group_ids !== undefined)
			for (let i = 0; i < group_ids.length; i++)
				v.push(group_ids[i])
		const p = make_query<GetGroupsR>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(value.results)
			})
	}

	// static add_student_to_group(student_id, group_id) { }
	// static remove_student_from_group(student_id, group_id) { }

	static add_new_class(
		error: ErrorHandler,
		success: SuccesHandler<null>,
		teacher_id: number,
		group_id: number,

		class_title: String) {
		const q: String = "CALL add_new_class(?,?,?)"
		const v: any[] = [teacher_id, group_id, class_title]
		const p = make_query<addNewClassR>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(null)
			})
	}
	static get_classes(
		error: ErrorHandler,
		success: SuccesHandler<GetClassesR[]>,
		class_title: String,
		teacher_id: number) {
		const q = "SELECT teacher_id, class_id, group_id, class_title, group_title FROM get_classes WHERE teacher_id=?" + (class_title === undefined ? ';' : ' and class_title like ?;')
		const v = [teacher_id, class_title]
		const p = make_query<GetClassesR>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(value.results)
			})
	}
	/**
	 * succes return 'true' when no collision detected
	 * 
	 * @param error 
	 * @param success 
	 * @param from 
	 * @param duration 
	 * @param group_id 
	 * @param week_cnt 
	 */
	static check_register_ccollision(
		error: ErrorHandler,
		success: SuccesHandler<boolean>,
		from: number,
		duration: number,
		class_id: number,
		week_cnt: number
	) {
		const q = "SELECT check_collision(?,?,?,?) as collisions"
		const v = [from, duration, week_cnt, class_id]
		const p = make_query<CheckRegisterCollision>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(value.results[0].collisions == 0)
			})
	}

	static get_partial_registered_classes(
		error: ErrorHandler,
		success: SuccesHandler<GetRegisteredClassesParticial[]>,
		from: number,
		to: number,
		group_id: number[],
		teacher_id?: number) {
		logger._info(`get registered classes for\n\t group:[${group_id}]; teacher:[${teacher_id}]; from:[${from}]; to[${to}]`)
		const q = `SELECT id, start, group_id, duration_minuts, freq_cron, week_cnt  from get_registered_classes  where start>=? and start<=? ` +
			(group_id.length == 0 ? '' : 'and group_id in (' + (new Array(group_id.length).fill('?')).join() + ')') +
			(teacher_id === null ? '' : 'and teacher_id=? ')
		const v: any = [from, to]

		if (group_id.length == 0)
			group_id.forEach(el => v.push(el));
		if (teacher_id !== null) v.push(teacher_id)

		const p = make_query<GetRegisteredClassesParticial>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(value.results)
			})
	}
	static get_full_registered_classes(
		error: ErrorHandler,
		success: SuccesHandler<GetRegisteredClassesFull[]>,
		from: number,
		to: number,
		group_id: number[],
		teacher_id?: number) {
		logger._info(`get registered classes for\n\t group:[${group_id}]; teacher:[${teacher_id}]; from:[${from}]; to[${to}]`)
		const q = `SELECT id, start, group_id, teacher_id, duration_minuts, freq_cron, class_title, group_title, first_name, second_name, thrid_name, week_cnt from get_registered_classes  where start>=? and start<=? ` +
			(group_id.length == 0 ? '' : 'and group_id in (' + (new Array(group_id.length).fill('?')).join() + ')') +
			(teacher_id === null ? '' : 'and teacher_id=? ')
		const v: any = [from, to]

		if (group_id != undefined && group_id.length > 0)
			group_id.forEach(el => v.push(el));
		if (teacher_id !== null) v.push(teacher_id)

		const p = make_query<GetRegisteredClassesFull>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(value.results)
			})
	}
	// static delete_class(id) { }

	static delete_classes(
		error: ErrorHandler,
		success: SuccesHandler<null>,
		classes_id: number[],
		teacher_id: number) {
		logger._info(`delete classes ${classes_id}`)
		const q = "delete from teacher_classes where teacher_id=? and id in (" + new Array(classes_id.length).fill('?').join() + ")"
		const v = [teacher_id]
		classes_id.forEach(el => v.push(el))
		const p = make_query<null>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(null)
			})
	}

	static register_class(
		error: ErrorHandler,
		success: SuccesHandler<RegisterNewClassesR>,
		class_id: number,
		freq_cron: number,
		start: number,
		duration_minuts: number,
		week_cnt: number) {
		logger._info(`register class ${class_id} ${freq_cron} ${duration_minuts}`)
		const q = "select register_class(?,?,?,?,?) as id;"
		const v = [class_id, freq_cron, start, duration_minuts, week_cnt]
		const p = make_query<RegisterNewClassesR>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(value.results[0])
			})
	}

	static delay_registered_class_on_week(
		error: ErrorHandler,
		success: SuccesHandler<null>,
		class_id: number,
		start_utc: number,
		week_cnt: number) {
		const week: number = 7 * 24 * 60 * week_cnt
		const q = "CALL delay_registered_class(?,?);"
		const v = [class_id, start_utc + week]
		logger._info(`update class delay ${class_id} on [${start_utc + week}]`)
		const p = make_query<null>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(null)
			})
	}

	/** clear all stored sessions from DB 
	 * @param {ErrorHandler} success
	 * @param {SuccesHandler<null>} error
	*/
	static clear_sessions(
		error: ErrorHandler,
		success: SuccesHandler<null>) {
		logger._info(`clear saved sessions`, true)
		const q = "delete from sessions"
		const p = make_query<null>(q)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(null)
			})
	}

	static get_sessions_token(
		error: ErrorHandler,
		success: SuccesHandler<GetSessionsTokenR[]>,
		teacher_id: number) {
		const q: String = `
			SELECT get_session_token(?) as token;`
		const v: any[] = [teacher_id]
		const p = make_query<GetSessionsTokenR>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(value.results)
			})
	}


	static unregister_class(
		error: ErrorHandler,
		success: SuccesHandler<null>,
		registered_class_id: number) {
		logger._info(`unregister_class ${registered_class_id}`, true)
		const q = "CALL unregister_class(?);"
		const v = [registered_class_id]
		const p = make_query<null>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(null)
			})
	}
	static unregister_classes(
		error: ErrorHandler,
		success: SuccesHandler<null>,
		registered_class_id: number[]) {
		logger._info(`unregister_class ${registered_class_id}`, true)
		const q = "delete from shedule where id in (" + new Array(registered_class_id.length).fill('?').join() + ")"
		const v = registered_class_id
		const p = make_query<null>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(null)
			})
	}
	static save_sesion(
		error: ErrorHandler,
		success: SuccesHandler<null>,
		id: number,
		group_id: number,
		openvidu_session: String) {
		const q: String = "CALL save_session(?,?,?);"
		const v: any = [id, group_id, openvidu_session]
		logger._info(`save sessions for group: ${v}`, true)

		const p = make_query<null>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error)
					error(value.error)
				else
					success(null)
			})
	}

	static delete_sesion(
		error: ErrorHandler,
		success: SuccesHandler<string[]>,
		group_id: number) {
		const q = "select delete_session(?) as deleted;"
		logger._info(`close session [${group_id}]`, true)
		const v: any[] = [group_id]
		const p = make_query<string>(q, v)
		if (p !== undefined)
			p.then((value) => {
				if (value.error || value.results.length == 0)
					error(value.error)
				else
					success(value.results)
			})
	}
}
// for (let i=0; i<10;i++)
// 	bcrypt.hash('123', 10).then(function (hash: any) {
// 		logger._info(`password: ${hash}`)
// 	});
// module.exports = { DataBase: DataBase }
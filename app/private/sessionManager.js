'use strict'

const { json } = require('body-parser');

require('dotenv').config();

const DB = require('./ManagerDB').DataBase
const logger = require('./logger')(__filename);
const OpenVidu = require("openvidu-node-client").OpenVidu;
const CronJob = require('cron').CronJob;

const OPENVIDU_URL = process.env.OPENVIDU_URL;
// const OPENVIDU_URL = 'http://localhost'
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET;

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET)


const get_time_in_minuts = (dt) => {
	return Math.floor(dt / (60 * 1000))
}

const get_day = (dt) => {
	return (dt.getDay() - 1 == -1 ? 6 : dt.getDay() - 1) + 1
}
const getMonday = (now) => {
	let d = new Date(now);
	const day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
	const m = new Date(d.setDate(diff))
	m.setHours(0)
	m.setMinutes(0)
	m.setSeconds(0)
	return m
}

const class_exec = (class_el) => {
	logger._debug(`cron execute ${JSON.stringify(class_el)}`)
	openvidu.createSession().then(session => {
		logger._info(`session [${class_el.id}] created [${session.sessionId}] for [${class_el.group_id}]`, true)
		DB.save_sesion(
			(err) => {
				logger._error(`cant save session [${JSON.stringify(class_el.id)}][${session.sessionId}] for [${JSON.stringify(class_el.group_id)}]`)
				session.close()
			},
			() => {
				logger._debug(`expire in [${class_el.duration_minuts * 60 * 1000}]`, true)
				setTimeout(
					class_expire,
					class_el.duration_minuts * 60 * 1000,
					class_el)
			},
			class_el.group_id,
			session.sessionId)

	}).catch(err => {
		logger._error(`cant create session for [${JSON.stringify(class_el.group_id)}]\n\t${err.message}`)
	})
}

const class_expire = async (class_el) => {
	DB.delete_sesion(
		(err) => { logger._error(`cant delete session for [${JSON.stringify(class_el.id)}]`) },
		(res) => {
			const session = openvidu.activeSessions.find(s => s.sessionId == res[0].deleted)
			logger._info(`delete session [${JSON.stringify(class_el.id)}]`)

			if (session !== undefined)
				session.close()

			if (class_el.week_cnt == 0)
				unregister_class(class_el.id)
			else {
				const now_m = get_time_in_minuts(Date.now())
				logger._debug(`cur date now [${Date.now()}] minuts [${now_m}]`)
				delay_class_on_week(class_el.id, class_el.start, class_el.week_cnt)
			}
		},
		class_el.id)
}

const delay_class_on_week = (id, start, week_cnt) => {
	logger._info(`delay class [${id}] on [${week_cnt * 7}] days`)
	DB.delay_registered_class_on_week(
		(err) => { logger._error(`cant delay class [${id}]\n\t[${err.message}]`, true) },
		() => { },
		id,
		start,
		week_cnt
	)
}

const unregister_class = (id) => {
	DB.unregister_class(
		(err) => { logger._error(`cant unregistred class [${id}]\n\t[${err.message}]`, true) },
		() => { logger._info(`class unregistred [${id}]`, true) },
		id)
}

const setup_new_job = (class_el) => {
	logger._info(`load ${JSON.stringify(class_el)}`, true)
	const now_m = get_time_in_minuts(Date.now())
	const job_start = get_time_in_minuts(class_el.start * 60 * 1000)
	const cur_week = Math.floor(now_m / (60 * 24 * 7))
	const job_week = Math.floor(job_start / (60 * 24 * 7))

	if (now_m > class_el.start && now_m < class_el.start + class_el.duration_minuts) {
		class_exec(class_el)
		if (class_el.week_cnt == 0) return
	}
	if (now_m > class_el.start + class_el.duration_minuts) {
		if (class_el.week_cnt == 0)
			unregister_class(class_el.id)
		else {
			let week_delay = cur_week - job_week;
			week_delay =
				Math.floor(week_delay / class_el.week_cnt) *
				class_el.week_cnt
			week_delay = week_delay == 0 ?
				class_el.week_cnt :
				week_delay + class_el.week_cnt

			delay_class_on_week(
				class_el.id,
				class_el.start,
				week_delay)

		}
	}

	try {
		const job = new CronJob(
			class_el.freq_cron,
			() => {
				class_exec(class_el)
				if (class_el.week_cnt == 0) job.stop()
			},
			null,
		)
		logger._info(`setup new cron for [${JSON.stringify( class_el)}]`)
		job.start()
		delete class_el.freq_cron
	} catch (err) {
		logger._error(`cron execute failed ${err.message} element:\n[${JSON.stringify(class_el)}]`)
	}
}

class SessionManager {
	static first_load() {
		DB.clear_sessions(() => { }, () => { })
		openvidu.fetch().then(v => {
			const m = getMonday(Date.now())
			DB
				.get_registered_classes(
					err => { logger._error(`get register classes ${err.message}`) },
					classes => { 
						logger._info(`loaded ${classes.length} registered classes`)
						classes.forEach(el => setup_new_job(el)) 
					},
					0,
					4294967295,
					[], null
				)


		}).catch(err => {
			logger._error(`cant fetch sessions\n\t${err.message}`)
		}).finally(() => {
			openvidu.activeSessions.forEach(s => s.close())
		})
	}
	static new_registered_class(class_el) {
		setup_new_job(class_el)
	}
}

module.exports = { SessionManager }
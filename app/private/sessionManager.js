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

const class_exec = (el) => {
	logger._debug(`cron execute ${JSON.stringify(el)}`)
	openvidu.createSession().then(session => {
		logger._info(`session created [${session.sessionId}] for [${el.group_id}]`, true)
		DB.save_sesion(el.group_id, session.sessionId)

		logger._debug(`expire in [${el.duration_minuts * 60 * 1000}]`, true)
		setTimeout(
			class_expire,
			el.duration_minuts * 60 * 1000,
			el)
	})
}
const class_expire = async (class_el) => {
	const sessionId = await DB.delete_sesion(class_el.group_id)
	const session = openvidu.activeSessions.find(s => s.sessionId == sessionId.openvidu_session)
	logger._debug(`close [${JSON.stringify(sessionId)}]`)

	if (session !== undefined)
		session.close()

	if (class_el.once)
		DB.unregister_class(
			(err) => { logger._error(`class mot unregistred [${class_el.id}]\n\t[${err.message}]`, true) },
			() => { logger._info(`class unregistred [${class_el.id}]`, true) },
			class_el.id)
}



const setup_new_job = (class_el) => {
	logger._info(`load ${JSON.stringify(class_el)}`, true)
	try {
		const job = new CronJob(
			class_el.freq_cron,
			() => {
				class_exec(class_el)
				if (class_el.once) job.stop()
			},
			null,
		)
		job.start()
	} catch (err) {
		logger._error(`cron execute failed ${err.message} element:\n[${JSON.stringify(class_el)}]`)
	}
}

class SessionManager {
	static first_load() {
		openvidu.fetch().then(v => {
			DB
				.get_registered_classes(
					err => { logger._error(`get register classes ${err.message}`) },
					classes => { classes.forEach(el => setup_new_job(el)) })


		}).finally(() => {
			openvidu.activeSessions.forEach(s => s.close())
		})
	}
}

module.exports = { SessionManager }
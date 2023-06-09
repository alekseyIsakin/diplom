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

const class_exec = (class_el) => {
	logger._debug(`cron execute ${JSON.stringify(class_el)}`)
	openvidu.createSession().then(session => {
		logger._info(`session created [${session.sessionId}] for [${class_el.group_id}]`, true)
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
			logger._info(`delete session for [${JSON.stringify(class_el.id)}]`)

			if (session !== undefined)
				session.close()

			if (class_el.once)
				DB.unregister_class(
					(err) => { logger._error(`cant unregistred class [${class_el.id}]\n\t[${err.message}]`, true) },
					() => { logger._info(`class unregistred [${class_el.id}]`, true) },
					class_el.id)
		},
		class_el.group_id)
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


		}).catch(err => {
			logger._error(`cant fetch sessions\n\t${err.message}`)
		}).finally(() => {
			openvidu.activeSessions.forEach(s => s.close())
		})
	}
}

module.exports = { SessionManager }
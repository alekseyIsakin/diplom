'use strict'
require('dotenv').config();

const DB = require('./ManagerDB').DataBase
const logger = require('./logger')(__filename);
const OpenVidu = require("openvidu-node-client").OpenVidu;

const CronJob = require('cron').CronJob;
const OPENVIDU_URL = process.env.OPENVIDU_URL;
// const OPENVIDU_URL = 'http://localhost'
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET;

const openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET)

const setup_new_job = (el) => {
	logger._info(`load ${JSON.stringify(el)}`, true)
	try {
		el.cnt = 2
		const job = new CronJob(
			el.freq_cron,
			() => {
				logger._info(`cron execute [${el.cnt}] ${JSON.stringify(el)}`, true)
				el.cnt -= 1

				if (el.cnt <= 0)
					job.stop()
			},
			null,
		)
		job.start()
	} catch (err) {
		logger._error(`cron execute failed ${err.message} element:\n[${JSON.stringify(el)}]`)
	}
}

class SessionManager {
	static first_load() {
		openvidu.fetch().then(v => {
			DB
				.get_registered_classes()
				.forEach(el => setup_new_job(el))
		})
	}
}

module.exports = { SessionManager }
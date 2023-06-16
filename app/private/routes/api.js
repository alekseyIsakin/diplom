const express = require('express')
const router = express.Router()
const ROUTES = require('./ROUTES')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const logger = require('../logger')(__filename);
const path = require('path')

const { DataBase } = require('../ManagerDB')
const { SessionManager } = require('../sessionManager')

router.get('/shedule/users/:user_id',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	async (req, res) => {
		const user_id = Number(req.params.user_id)
		logger._debug(`get /shedule/users/ ${user_id}`)

		DataBase.get_sessions_token(
			(err) => { res.status(500).send() },
			(result) => {
				logger._debug(`send token ${JSON.stringify(result)}`)
				res.status(200).json(result)
			},
			user_id)
	})
router.post('/sessions/:session_id/connections',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	async (req, res) => {
		const user_id = Number(req.session.passport.user.id)
		const session_id = req.params.session_id

		SessionManager.createConnection(req.params.session_id)
			.then(v => {
				logger._info(`session token connection [${session_id}]`)

				if (v === undefined) res.status(404).send()
				else res.send(v.token)
			}).catch(async e => {
				if (e.message != '404') { logger._error(e.message); res.status(502).send(); return }

				DataBase.get_sessions_token(
					() => { res.send(404) },
					async (result) => {
						await SessionManager.fetchSesions()

						if (result.some(el => el.token == session_id)) {
							let session = SessionManager.getExistedSession(session_id)
							if (!session) {
								session = await SessionManager.reopenSesion(session_id)
							}
							const connection = await session.createConnection()
							res.status(200).send(connection.token)
						} else { es.send(404) }
					},
					user_id)
			})
	}
)
// router.get('/sessions/:token',
// 	ensureLogIn(new URL('login', ROUTES.Auth).href),
// 	async (req, res) => {
// 		const user_id = Number(req.session.passport.user.id)
// 		const session_id = req.params.token

// 		SessionManager.fetchSesions()
// 		DataBase.get_student_sessions_token(
// 			() => {
// 				res.send(404)
// 			},
// 			async (result) => {
// 				await SessionManager.fetchSesions()

// 				if (result.some(el => el.token == session_id)) {
// 					let session = SessionManager.getExistedSession(session_id)
// 					if (!session) {
// 						session = await SessionManager.reopenSesion(session_id)
// 					}
// 					res.status(200).send(session_id)
// 				}
// 			},
// 			user_id)
// 	}
// )
module.exports = router;

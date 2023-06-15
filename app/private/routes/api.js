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
		DataBase.get_sessions_token(
			(err) => { res.status(500).send() },
			(result) => {
				logger._debug(`send token ${JSON.stringify(result)}`)
				res.status(200).json(result)
			}, user_id
		)
	})
router.post('/sessions/:token/connections',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	async (req, res) => {
		const token = await SessionManager.createConnection(req.params.token)
		res.send(token)
	}
)
module.exports = router;

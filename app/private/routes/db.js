const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const ROUTES = require('./ROUTES');
const logger = require('../logger')(__filename);


router.post('/classes',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		logger._debug(`new class ${JSON.stringify(req.body)}`)
		res.status(200).send('new class created')
	})
router.get('/classes/:teacherID',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		const from = req.query.from | 0
		const cnt = req.query.to | 25
		logger._debug(`list classes for  ${req.params.teacherID} [${from} : ${from+cnt}] [${JSON.stringify(req.query)}]`)
		res.json({})
})
router.delete('/classes/:teacherID/:classID',
	// ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		logger._debug(`delete class ${req.params.teacherID} [${req.params.classID}]`)
		res.json({})
})
module.exports = router;

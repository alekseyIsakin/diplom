const express = require('express')
const router = express.Router()
const ROUTES = require('./ROUTES')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const logger = require('../logger')(__filename);


router.get('/shedule',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	async (req, res) => {
		res.render('shedule', { nick: JSON.stringify(req.session.passport.user) });
	})

module.exports = router;

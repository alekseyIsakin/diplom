const express = require('express')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router()
const ROUTES = require('./ROUTES')


router.get('/shedule',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	async (req, res) => {
		res.render('shedule', { nick: JSON.stringify(req.session.passport.user) });
	})

module.exports = router;

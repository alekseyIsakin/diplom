const express = require('express')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router()
const ROUTES = require('./ROUTES')

router.get('/teacher',
	ensureLogIn(ROUTES.Auth + '/login'),
	async (req, res) => {
		res.render('teacher', { nick: JSON.stringify(req.session.passport.user) });
	})

module.exports = router;

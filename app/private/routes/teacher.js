const express = require('express')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router()
const logger = require('../logger')(__filename);
const ROUTES = require('./ROUTES')

const is_teacher = (req, res, next) => {
	const group_cnt = req.session
		.passport
		.user
		.group_id
		.every(g_id => g_id == null)

	if (group_cnt)
		next()
	else
		res.status(403).send('access denied')
}

router.get('/teacher',
	ensureLogIn(ROUTES.Auth + '/login'),
	is_teacher,
	(req, res) => {
		res.render('teacher', { nick: JSON.stringify(req.session.passport.user) });
	})

module.exports = router;

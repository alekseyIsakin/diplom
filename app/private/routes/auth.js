'use strict'


const express = require('express')
const passport = require('passport');
const logger = require('../logger')(__filename);
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router()
const ROUTES = require('./ROUTES')
const db = require('../ManagerDB').DataBase

passport.use(new LocalStrategy(
	{ usernameField: 'nick', passwordField: 'password' },
	async (nick, password, next) => {
		db.check_user_password(
			() => next(false, null),
			(result) => next(null, {
				id: result.id,
				nick: result.nick,
				group_id: result.group_id
			}),
			nick,
			password
		)
	}
))

passport.serializeUser((user, next) => {
	next(null, user);
});

passport.deserializeUser((user, next) => {
	process.nextTick(function () {
		return next(null, user);
	});
});

router.get('/', (req, res) => {
	res.redirect(new URL(ROUTES.Auth + 'login').pathname)
})
router.get('/login', (req, res) => {
	res.render('login');
})

router.post('/login/password',
	(req, res, next) => {
		logger._debug(`try login [${req.body.nick}][***] [${new URL(ROUTES.Auth + 'login').pathname}]`)
		next()
	},
	passport.authenticate('local', {
		failureRedirect: new URL(ROUTES.Auth + 'login').pathname,
		// successReturnToOrRedirect: new URL(ROUTES.Index + 'shedule').pathname,
		failureMessage: true
	}),
	(req, res) => {

		res.cookie('user_id', req.session.passport.user.id, { maxAge: Date.now() + 24 * 60 * 60 * 1000 })
		res.cookie('group_id',
			req.session.passport.user.group_id.join('&'),
			{ maxAge: Date.now() + 24 * 60 * 60 * 1000 })
		res.redirect(new URL(ROUTES.Index + 'shedule').pathname)
	}
)

router.get('/logout', function (req, res, next) {
	logger._debug(`logout [${req.session.passport.user.nick}][***]`)
	res.clearCookie('user_id')
	res.clearCookie('group_id')
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect(new URL(ROUTES.Auth + 'login').pathname);
	});
})


module.exports = router;
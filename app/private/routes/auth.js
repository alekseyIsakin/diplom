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
		db. success(
			() => next(false, null),
			() => next(null, {nick:nick, password:'***'}),
			nick, 
			password
		)
	}
))

passport.serializeUser((user, next) => {
	user.password = '***'
	next(null, user);
});

passport.deserializeUser((user, next) => {
	process.nextTick(function () {
		return next(null, user);
	});
});

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
		successReturnToOrRedirect: new URL(ROUTES.Index + 'shedule').pathname,
		failureMessage: true
	}),
)

router.get('/logout', function (req, res, next) {
	logger._debug(`logout [${req.session.passport.user.nick}][***]`)
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect(new URL(ROUTES.Auth + 'login').pathname);
	});
})


module.exports = router;
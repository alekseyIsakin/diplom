'use strict'


const express = require('express')
const passport = require('passport');
const logger = require('../logger')(__filename);
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router()
const ROUTES = require('./ROUTES')

passport.use(new LocalStrategy(
	{ usernameField: 'nick', passwordField: 'password' },
	async (nick, password, next) => {
		let user = false
		return next(null, { nick, password })
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
		logger._debug(`try login [${req.body.nick}][***]`)
		next()
	},
	passport.authenticate('local', {
		failureRedirect: new URL('/login', ROUTES.Auth).href,
		successReturnToOrRedirect: new URL('/shedule', ROUTES.Auth).href,
		failureMessage: true
	}),
)

router.get('/logout', function (req, res, next) {
	logger._debug(`logout [${'user_name_placeholder'}][***]`)
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
})


module.exports = router;
'use strict'

const express = require('express')
const app = express()
const path = require('path')
const uuid = require('uuid').v4
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var cookieParser = require('cookie-parser');

const port = 80

const { pool } = require('./db')

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public/views"));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	genid: (req) => {
		console.log(`Request object sessionID from client: ${req.sessionID}`)
		return uuid() // use UUIDs for session IDs
	},
	secret: 'keyboard cat',
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	store: new FileStore(),
	cookie: { maxAge: 60e3 },
}));
app.use(passport.authenticate('session'));
app.use(function (req, res, next) {
	var msgs = req.session.messages || [];
	res.locals.messages = msgs;
	res.locals.hasMessages = !!msgs.length;
	req.session.messages = [];
	next();
});



passport.use(new LocalStrategy(
	{ usernameField: 'nick', passwordField: 'password' },
	async (nick, password, next) => {
		let check = false
		console.log('Inside local strategy callback')
		try {
			const res_query = await pool.query(
				"select * from check_user_password($1, $2);",
				[nick, password]
			);
			check = res_query.rows[0]['check_user_password']
			if (check == true)
				return next(null, nick)
		} catch (error) {
			console.log(error)
			return next(null, error)
		}
		return next(null, false)
	}
))
passport.serializeUser((user, done) => {
	console.log('Inside serializeUser callback. User id is save to the session file store here')
	done(null, user);
});

passport.deserializeUser((user, cb) => {
	process.nextTick(function () {
		return cb(null, user);
	});
});






app.post('/login/password',
	passport.authenticate('local', {
		failureRedirect: '/login',
		successReturnToOrRedirect: '/manage',
		failureMessage: true
	}),
)


app.get('/login', (req, res) => {
	console.log(`[${req.sessionID}] login [${req.isAuthenticated()}]`)
	res.render('login');
})

app.get('/', async (req, res) => {
	console.log(`[${req.sessionID}] home [${req.isAuthenticated()}]`)
	res.render('main');
})

app.get('/logout',function (req, res, next) {
	console.log(`[${req.sessionID}] logout`)
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
})

app.get('/manage', ensureLogIn('/'), async (req, res) => {
	console.log(`[${req.sessionID}] manage [${req.isAuthenticated()}]`)

	res.render('manage', {user: req.session.passport});
})

app.listen(port, () => console.log('server has been started'))

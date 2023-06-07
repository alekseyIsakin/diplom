'use strict'
require('dotenv').config();

const express = require('express')
const path = require('path')
const logger = require('./private/logger')(__filename);
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport');
const uuid = require('uuid').v4
// Routs
const Auth = require('./private/routes/auth');
const Index = require('./private/routes/index');
const Admin = require('./private/routes/admin');
const Teacher = require('./private/routes/teacher');
const ROUTES = require('./private/routes/ROUTES')

const app = express()

app.set('views', __dirname + '/private/views')
app.set("view engine", "pug");
app.enable('trust proxy');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
	genid: (req) => {
		return uuid() // use UUIDs for session IDs
	},
	secret: 'keyboard cat',
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	store: new FileStore(),
	cookie: { maxAge: 24 * 60 * 60e3 },
}));
app.use(passport.authenticate('session'));

app.use(ROUTES.Auth.pathname, Auth);
app.use(ROUTES.Index.pathname, Index);
app.use(ROUTES.Index.pathname, Teacher);
app.use(ROUTES.Admin.pathname, Admin);

app.use(function (req, res, next) {
	let x = new URL('shedule', ROUTES.Index).href 
	res.redirect(new URL('shedule', ROUTES.Index).href )
	next(null, next);
});

app.listen(process.env._APP_PORT, () => {
	logger._info(`server has been started, listen: ${process.env._APP_PORT}`)
	logger._debug(`Node version: ${process.version}`)
})
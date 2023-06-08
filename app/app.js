'use strict'



const express = require('express')
const path = require('path')
const logger = require('./private/logger')(__filename);
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport');
const uuid = require('uuid').v4

require('dotenv').config();
// Routs
const Auth = require('./private/routes/auth');
const Index = require('./private/routes/index');
const Admin = require('./private/routes/admin');
const Teacher = require('./private/routes/teacher');
const Route_DB = require('./private/routes/db');
const ROUTES = require('./private/routes/ROUTES')

const app = express()

require('./private/ManagerDB')
require('./private/sessionManager').SessionManager.first_load()

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
app.use(ROUTES.DB.pathname, Route_DB);

app.use(function (req, res, next) {
	logger._debug(`[${req.url}] not found`, true)
	res.redirect(new URL('shedule', ROUTES.Index).href )
	next(null, next);
});

app.listen(process.env._APP_PORT, () => {
	logger._info(`server has been started, listen: ${process.env._APP_PORT}`, true)
	logger._debug(`Node version: ${process.version}`, true)
	logger._debug(`DEBUG is on`)
})
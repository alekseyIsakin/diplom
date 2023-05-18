'use strict'

const dt = require('./private/dateTime')
const express = require('express')
const app = express()
const path = require('path')
const uuid = require('uuid').v4
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const passport = require('passport');
const cookieParser = require('cookie-parser');

const authRouter = require('./private/routes/auth');
const indexRouter = require('./private/routes/index');
const adminRouter = require('./private/routes/admin_route');

const token_generator = require('./private/token_generator');
const logger = require('./private/logger')(__filename);
const db = require('./private/db')
const { exit } = require('process')


// const token_generator = require('./private/token_generator');

require('dotenv').config();
db.init_db((error) => {
	if (error){
		logger._error('failed to connect to db. Terminate app')
		exit()
	}
	// dt.setup_cur_time()
	token_generator.generate_tokens()
})
const port = process.env.PORT

app.set('views', __dirname + '/private/views')
app.set("view engine", "pug");
app.enable('trust proxy');

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
app.use(function (req, res, next) {
	var msgs = req.session.messages || [];
	res.locals.messages = msgs;
	res.locals.hasMessages = !!msgs.length;
	req.session.messages = [];
	next();
});

app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.use(function (req, res, next) {
	res.sendStatus(404)
	next(null, next);
});

app.listen(port, () => {
	logger._debug(`server has been started. Node version: ${process.version}`)
})

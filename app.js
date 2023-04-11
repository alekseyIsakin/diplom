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
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const token_generator = require('./private/token_generator');


// const token_generator = require('./private/token_generator');

require('dotenv').config();
require('./private/db').init_db((error) => {
	if (error)
		return
	dt.setup_cur_time()
	token_generator.generate_tokens()
})
const port = process.env.PORT


app.set("view engine", "pug");

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

app.use('/', authRouter);
app.use('/', indexRouter);

app.use(function (req, res, next) {
	res.send(404)
	next(null, next);
});

console.log('123123')
require('intel').info('---1234124')

app.listen(port, () => { 
	console.log(`server has been started\nnode version: ${process.version}`) 
})

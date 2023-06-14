const express = require('express')
const router = express.Router()
const ROUTES = require('./ROUTES')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const logger = require('../logger')(__filename);
const path = require('path')


router.get('/shedule',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	async (req, res) => {
		res.render('shedule', { nick: JSON.stringify(req.session.passport.user) });
	})

router.get('/test', (req, res) => {
	const p = __dirname.split('\\')
	p.splice(-1,1)
	res.sendFile('test.html', {root: p.join('\\') + '\\views'})
})

router.get('/meet', (req, res) => {
	const p = __dirname.split(path.sep)
	p.splice(-2,3)
	let p_s = p.join(path.sep)
	p_s = path.join(p_s, 'public', 'html')
	res.sendFile('index.html', {root: p_s })
})

module.exports = router;

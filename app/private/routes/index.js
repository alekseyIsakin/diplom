const express = require('express')
const router = express.Router()
const ROUTES = require('./ROUTES')
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const logger = require('../logger')(__filename);
const path = require('path')
const { DataBase } = require('../ManagerDB')


router.get('/shedule',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	async (req, res) => {
		const groups = req.session.passport.user.group_id
		DataBase.get_groups(
			() => {
				res.render('shedule', { Groups: ['internal error'] });
			},
			(result) => {
				res.render('shedule', {
					Groups:
						result.map(v => v.group_title)
				});
			},
			groups
		)
	})

// router.get('/test', (req, res) => {
// 	const p = __dirname.split('\\')
// 	p.splice(-1, 1)
// 	res.sendFile('test.html', { root: p.join('\\') + '\\views' })
// })

router.get('/meet',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		res.render('meet')
	})

module.exports = router;

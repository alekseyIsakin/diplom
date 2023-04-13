'use strict'

const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const pool = require('../private/db').pool
const time = require('../private/dateTime')
const db = require('../private/db')

router.get('/', async (req, res) => {
	let user = {}
	if (req.session.passport)
		user = req.session.passport.user
	res.render('main', { user: user.nick });
})

router.get('/table', async (req, res) => {
	db.load_table((error, classes) => {
		let rasp = []
		let ct = time.setup_cur_time()
		rasp.length = db.stored_data.days.length * db.stored_data.times.length * db.stored_data.groups.length * 2
		for (let row in classes) {
			const cl = classes[row]
			const index = (cl.up ? 0 : 1) + (cl.group_id - 1) * 2 + (cl.time_id) * db.stored_data.groups.length * 2 + cl.day_id * db.stored_data.times.length * db.stored_data.groups.length * 2

			if (cl.day_id != null) {
				rasp[index] = {
					class: cl.class,
					cabinet: cl.cabinet,
					teacher: `${cl.t_sname} ${cl.t_fname} ${cl.t_tname}`,
					is_now: false
				}
			}
		}

		if (ct.time == time.TOO_LATE) { ct.time = db.stored_data.times.length - 1 }

		for (let i in db.stored_data.groups) {
			const index = (ct.is_up ? 0 : 1) + (db.stored_data.groups[i].id - 1) * 2 + (ct.time) * db.stored_data.groups.length * 2 + ct.day_id * db.stored_data.times.length * db.stored_data.groups.length * 2
			if (rasp[index]) {
				rasp[index].is_now = true
			}
			else {
				rasp[index] = { is_now: true }
			}
		}

		res.render('table', { days: db.stored_data.days, time: db.stored_data.times, rasp: rasp, groups: db.stored_data.groups, cur_day: ct.day_id });
	})
})
router.get('/manage', ensureLogIn('/'), async (req, res) => {
	res.render('manage', { nick: JSON.stringify(req.session.passport.user) });
})

router.get('/meet',
	ensureLogIn('/'),
	async (req, res) => {
		let user = { role: 0 };

		if (req.session.passport)
			user = req.session.passport
		res.render('meet', req.session.passport);
	})

module.exports = router;
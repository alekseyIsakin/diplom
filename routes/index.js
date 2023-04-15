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

router.get('/table/:facultet_id/:year', async (req, res) => {
	const facultet_id = Number(req.params['facultet_id'])
	const year = Number(req.params['year'])

	db.load_table(facultet_id, year, (error, classes, facultet_id, year) => {
		let rasp = []
		let ct = time.setup_cur_time()
		let gr_cnt = 0
		let days_cnt = db.stored_data.days.length
		let times_cnt = db.stored_data.times.length
		const offset = {}
		const gr = db.stored_data.facultets[facultet_id][year]
		
		for (let i in gr){
			offset[i] = gr_cnt
			gr_cnt++
		}
		
		rasp.length = days_cnt * times_cnt * gr_cnt * 2
		for (let row in classes) {
			const cl = classes[row]
			const index = (cl.up ? 0 : 1) + offset[cl.group_id] * 2 + Number(cl.time_id - 1) * gr_cnt * 2 + Number(cl.day_id - 1) * times_cnt * gr_cnt * 2

			if (cl.day_id != null) {
				rasp[index] = {
					class: cl.class,
					cabinet: cl.cabinet,
					teacher: `${cl.t_sname} ${cl.t_fname} ${cl.t_tname}`,
					is_now: false
				}
			}
		}

		if (ct.time == time.TOO_LATE) { ct.time = times_cnt - 1 }

		for (let i in gr) {
			const index = (ct.is_up ? 0 : 1) + offset[i] * 2 + (ct.time - 1) * gr_cnt * 2 + (ct.day_id - 1) * times_cnt * gr_cnt * 2
			if (rasp[index]) {
				rasp[index].is_now = true
			}
			else {
				rasp[index] = { is_now: true }
			}
		}

		res.render('table', { days: db.stored_data.days, time: db.stored_data.times, rasp: rasp, groups: gr, cur_day: ct.day_id });
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
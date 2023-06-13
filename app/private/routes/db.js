const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const ROUTES = require('./ROUTES');
const logger = require('../logger')(__filename);
const { DataBase } = require('../ManagerDB')

const { SessionManager } = require('../sessionManager')
const cors = require('cors');
const { json } = require('body-parser');

// var corsOptions = {
// 	origin: 'http://192.168.3.4',
// 	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// 	methods: ['GET'],
// 	credentials: true
// }



router.get('/classes',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		let teacher_id = to_int_or_minus_one(req.query.teacher_id)
		let title = req.query.class_title

		logger._debug(`get list classes for ${req.query.teacher_id}`)
		DataBase.get_classes(
			(err) => res.status(502).send(),
			(result) => res.json(result),
			title,
			teacher_id)
	})
router.delete('/classes',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		const teacher_id = req.session.passport.user.id
		const trusted_id = []
		req.body.classes_id.forEach(el => {
			const e = to_int_or_minus_one(el)
			if (e != -1) trusted_id.push(e)
		})

		logger._debug(`delete class ${trusted_id} [${teacher_id}]`)
		DataBase.delete_classes(
			(err) => {
				logger._error(`cant delete classes [${err.message}]`)
				res.status(502).send()
			},
			() => { res.status(200).send() },
			trusted_id,
			teacher_id
		)
	})

router.post('/classes',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		logger._debug(`add class ${req.body.class_title} [${req.body.group_id}]`)
		const teacher_id = req.session.passport.user.id
		const g_id = to_int_or_null(req.body.group_id)

		DataBase.add_new_class(
			(err) => {
				logger._error(`cant add  new class. ${err.msg}`)
				res.status(502).send()
			},
			() => { res.status(200).send() },
			teacher_id,
			g_id,
			req.body.class_title,
		)
	})

router.get('/groups',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		DataBase.get_groups(
			(err) => res.status(502).send(),
			(result) => res.json(result)
		)

	})

router.delete('/shedule',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		logger._info(`request for delete ${JSON.stringify(req.body.id)}`)
		DataBase.unregister_classes(
			(err) => {
				res.status(502).send()
				logger._error(`request failed ${err.message}`)
			},
			() => {
				req.body.id.forEach(SessionManager.delete_job)
				res.status(200).send()
			},
			req.body.id)
	})
router.post('/shedule',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		const r = req.body
		const dt = new Date(Number(r.start) * 60 * 1000)
		r.id = -1
		r.duration_minuts = Number(r.duration)
		r.start = Number(r.start)
		r.week_cnt = Number(r.week_cnt)
		r.freq_cron = `0 ${dt.getMinutes()} ${dt.getHours()} * * ${dt.getDay()}`

		DataBase.register_class(
			(err) => { res.status(502).send('error') },
			(result) => {
				res.status(200).send('complete')
				r.id = result.id
				SessionManager.new_registered_class(r)
			},
			r.class_id,
			r.freq_cron,
			r.start,
			r.duration,
			r.week_cnt
		)
		logger._debug(`new registered class [${JSON.stringify(r)}]`)

	})
router.get('/shedule', (req, res) => {
	let group_id = []
	req.query.group_id.forEach(
		g_id => {
			const v = to_int_or_null(g_id)
			if (v != null)
				group_id.push(v)
		})
	let from = to_int_or_minus_one(req.query.from)
	let to = to_int_or_minus_one(req.query.to)
	let teacher_id = group_id.length == 0 ?
		req.session.passport.user.id :
		null


	const m = getMonday(Date.now())
	m.setHours(0)
	m_minuts = Math.floor(m.getTime() / (60 * 1000))

	if (from == -1) {
		from = m_minuts
	}
	if (to == -1) {
		to = m_minuts + 7 * 24 * 60 // add week
	}

	DataBase.get_full_registered_classes(
		(err) => {
			logger._error(`get shedule failed\n\t group:[${group_id}]; from:[${from}]; to[${to}]`)
			res.status(502).send()
		},
		(result) => {
			logger._debug(`send [${result.length}] classes`)
			res.status(200).json(result)
		},
		from, to, group_id, teacher_id)
})

const to_int_or_null = (value) => {
	const v = parseInt(value)
	if (isNaN(v))
		return null
	return v
}
const to_int_or_minus_one = (value) => {
	const v = parseInt(value)
	if (isNaN(v))
		return -1
	return v
}
function getMonday(d) {
	d = new Date(d);
	var day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
	return new Date(d.setDate(diff));
}
module.exports = router;

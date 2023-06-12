const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const ROUTES = require('./ROUTES');
const logger = require('../logger')(__filename);
const DB = require('../ManagerDB').DataBase
const SessionManager = require('../sessionManager').SessionManager
const cors = require('cors');

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

		logger._debug(`list classes for ${req.query.teacher_id}`)
		DB.get_classes(
			(err) => res.status(502).send(),
			(result) => res.json(result),
			title,
			teacher_id)
	})
router.delete('/classes',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		logger._debug(`delete class ${req.query.teacher_id} [${req.params.class_id}]`)
	})

router.get('/groups',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		DB.get_groups(
			(err) => res.status(502).send(),
			(result) => res.json(result)
		)

	})
router.delete('/classes/:teacherID/:classID',
	// ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		res.json({})
	})

router.post('/shedule',
	ensureLogIn(new URL('login', ROUTES.Auth).href),
	(req, res) => {
		const r = req.body
		const dt = new Date(Number(r.date) * 60 * 1000)
		r.duration = Number(r.duration)
		r.week_cnt = Number(r.week_cnt)
		r.freq_cron = `0 ${dt.getMinutes()} ${dt.getHours()} * * ${dt.getDay()}`

		DB.register_class(
			(err) => { res.status(502).send('error') },
			(result) => { res.status(200).send('complete') },
			r.class_id,
			r.freq_cron,
			r.date,
			r.duration,
			r.week_cnt
		)
		SessionManager.new_registered_class(r)
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
	let teacher_id = to_int_or_null(req.query.teacher_id)

	const m = getMonday(Date.now())
	m.setHours(0)
	m_minuts = Math.floor(m.getTime() / (60 * 1000))

	if (from == -1) {
		from = m_minuts
	}
	if (to == -1) {
		to = m_minuts + 7 * 24 * 60 // add week
	}

	DB.get_registered_classes(
		(err) => {
			logger._error(`get shedule failed\n\t group:[${group_id}]; from:[${from}]; to[${to}]`)
			res.status(502).json({})
		},
		(result) => {

			logger._debug(`send [${result.length}] classes`)
			res
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

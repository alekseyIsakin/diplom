'use strict'

const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const pool = require('../private/db').pool
const time = require('../private/dateTime')
const db = require('../private/db');
const logger = require('../private/logger')(__filename);



const is_trusted_ip = (req, res, next) => {
	logger.info(`acces to admin page from ${req.ip}`)
	next()
}

router.get('/',
	is_trusted_ip,
	(req, res) => {
		res.render('admin_page')
	})
router.get('/get_users',
	is_trusted_ip,
	(req, res) => {
		db.get_users_list((error, users) => {
			if (!error)
				res.json(users)
		})
	})
router.get('/users',
	is_trusted_ip,
	(req, res) => {
		res.render('ap_users', db.ROLES)
	})
router.get('/shedule',
	is_trusted_ip,
	(req, res) => {
		res.render('ap_shedule')
	})

module.exports = router;

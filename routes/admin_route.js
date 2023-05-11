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
router.get('/get_users/:role',
	is_trusted_ip,
	(req, res) => {
		const role = req.params['role']

		db.get_users_list(role, (error, users) => {
			if (!error)
				res.json(users)
		})
	})
router.get('/get_groups',
	is_trusted_ip,
	(req, res) => { 
		db.get_groups_list(role, (error, groups) => {
			if (!error)
				res.json(groups)
		})
	})
router.get('/students',
	is_trusted_ip,
	(req, res) => {
		res.render('ap_students', db.ROLES)
	})
router.get('/shedule',
	is_trusted_ip,
	(req, res) => {
		res.render('ap_shedule')
	})

module.exports = router;

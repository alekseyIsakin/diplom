const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', async (req, res) => {
	res.render('main');
})


router.get('/table', async (req, res) => {
	res.render('table', { user: req.session.passport });
})
router.get('/meet', async (req, res) => {
	res.render('table', { user: req.session.passport });
})
router.get('/manage', ensureLogIn('/'), async (req, res) => {
	console.log(`[${req.sessionID}] manage [${req.isAuthenticated()}]`)

	res.render('manage', { user: req.session.passport });
})

module.exports = router;
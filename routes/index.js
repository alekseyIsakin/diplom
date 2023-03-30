const { json } = require('express');
const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', async (req, res) => {
  user = {}
  if (req.session.passport)
    user = req.session.passport.user
  res.render('main', { user: user.nick });
})


router.get('/table', async (req, res) => {
  res.render('table', { user: req.session.passport });
})
router.get('/manage', ensureLogIn('/'), async (req, res) => {
  res.render('manage', { nick: JSON.stringify(req.session.passport.user) });
})

router.get('/meet', ensureLogIn('/'), async (req, res) => {
  res.render('meet', req.session.passport);
})

module.exports = router;
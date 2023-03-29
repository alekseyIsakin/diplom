
const express = require('express')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../db')
const router = express.Router()

passport.use(new LocalStrategy(
  { usernameField: 'nick', passwordField: 'password' },
  async (nick, password, next) => {
    let check = false
    try {
      const res_query = await pool.query(
        "select * from check_user_password($1, $2);",
        [nick, password]
      );

      if (res_query.rows.length > 0 && Object.hasOwn(res_query.rows[0], 'id')) {

        check = {
          id: res_query.rows[0]['id'],
          nick: res_query.rows[0]['nick'],
        }
        return next(null, check)
      }
    } catch (error) {
      return next(null, false)
    }
    return next(null, false)
  }
))

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, cb) => {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get('/login', (req, res) => {
  res.render('login');
})

router.post('/login/password',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successReturnToOrRedirect: '/manage',
    failureMessage: true
  }),
)

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})


module.exports = router;
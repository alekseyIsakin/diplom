
const express = require('express')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../private/db')
const router = express.Router()
const Roles = { unknown:-1, admin: 1, student: 2, teacher: 3 }

passport.use(new LocalStrategy(
	{ usernameField: 'nick', passwordField: 'password' },
	async (nick, password, next) => {
		let user = false
		try {
			const res_query = await pool.query(
				"select * from check_user_password($1, $2), is_teacher(id), is_student(id);",
				[nick, password]
			);

			user = {
				id: Number(res_query.rows[0].id),
				nick: res_query.rows[0].nick,
				role: Roles.unknown
			}

			if (res_query.rows[0].is_teacher) { 
				user.role = Roles.teacher
			}

			if (res_query.rows[0].is_student) {
				const res_query_gr = await pool.query(
					"select group_id from students as s where id=$1;",
					[user.id]
				);
				user['group'] = res_query_gr.rows[0].group_id
				user.role = Roles.student
			}

		} catch (error) {
			console.log(error)
		}
		return next(null, user)
	}
))

passport.serializeUser((user, next) => {
	next(null, user);
});

passport.deserializeUser((user, next) => {
	process.nextTick(function () {
		return next(null, user);
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
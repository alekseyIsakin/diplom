const { json } = require('express');
const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { pool } = require('../db')


Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
Date.prototype.getDayOfWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

days = []
times = []
rasp = []
group_cnt = 0

const init_db = async () => {
  try {
    const res_query = await pool.query(
      "select title from day_of_week;"
    );
    days = res_query.rows
  } catch (error) {
    console.error(error);
  }
  try {
    const res_query = await pool.query(
      "select from_as_minuts from shedule_time;"
    );
    times = res_query.rows
  } catch (error) {
    console.error(error);
  }
  try {
    const res_query = await pool.query(
      "select count(id) from students_group;"
    );
    group_cnt = Number(res_query.rows[0].count) - 1
  } catch (error) {
    console.error(error);
  }
}

router.get('/', async (req, res) => {
  user = {}
  if (req.session.passport)
    user = req.session.passport.user
  res.render('main', { user: user.nick });
})


router.get('/table', async (req, res) => {
  let date = new Date();
  let day_of_week = date.getDay() - 1
  let is_up = date.getWeek % 2 == 0
  let now = date.getMinutes() + (date.getHours() * 60)

  try {
    const res_query = await pool.query(
      "select * from get_class_shedule();"
    );

    rasp = []
    rasp.length = days.length * times.length * group_cnt * 2

    for (row in res_query.rows) {
      let cl = res_query.rows[row]
      let index = (cl.up ? 0 : 1) + (cl.group_id - 1) * 2 + (cl.time_id) * group_cnt * 2 + cl.day_id * times.length * group_cnt * 2
      if (cl.day_id != null) {
        let is_now = day_of_week == cl.day_id &&
            is_up == cl.up  &&
            now > cl.from_as_minuts && 
            now < cl.from_as_minuts + cl.duration

        rasp[index] = { class: cl.class, cabinet: cl.cabinet, teacher: cl.teacher, is_now: is_now }
      }
    }

    res.render('table', { days: days, time: times, rasp: rasp, group_count: group_cnt });
  } catch (error) {
    console.error(error);
  }

})
router.get('/manage', ensureLogIn('/'), async (req, res) => {
  res.render('manage', { nick: JSON.stringify(req.session.passport.user) });
})

router.get('/meet', ensureLogIn('/'), async (req, res) => {
  res.render('meet', req.session.passport);
})

init_db()
module.exports = router;
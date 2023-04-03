const { json } = require('express');
const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const { pool } = require('../db')

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
  try {
    const res_query = await pool.query(
      "select * from get_class_shedule();"
    );

    rasp = []
    rasp.length = days.length * times.length * group_cnt * 2

    for (row in res_query.rows) {
      let cl = res_query.rows[row]
      let index =  (cl.up ? 0 : 1) +  (cl.group_id - 1) * 2 + (cl.time_id) * group_cnt * 2 + cl.day_id * times.length * group_cnt * 2
      if (cl.day_id != null){
        rasp[index] = {class: cl.class, cabinet: cl.cabinet, teacher: cl.teacher}
      }
    }

    res.render('table', { days: days, time: times, rasp: rasp , group_count: group_cnt});
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
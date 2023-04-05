'use strict'

const express = require('express')
const router = express.Router()
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
const pool = require('../private/db').pool
const cur_time = require('../private/dateTime').setup_cur_time
const shedule_data = require('../private/db').stored_data

router.get('/', async (req, res) => {
  user = {}
  if (req.session.passport)
    user = req.session.passport.user
  res.render('main', { user: user.nick });
})

router.get('/table', async (req, res) => {

  try {
    const res_query = await pool.query(
      "select * from get_class_shedule;"
    );

    let rasp = []
    rasp.length = shedule_data.days.length * shedule_data.times.length * shedule_data.groups.length * 2
    let ct = cur_time()

    for (let row in res_query.rows) {
      const cl = res_query.rows[row]
      const index = (cl.up ? 0 : 1) + (cl.group_id - 1) * 2 + (cl.time_id) * shedule_data.groups.length * 2 + cl.day_id * shedule_data.times.length * shedule_data.groups.length * 2

      if (cl.day_id != null) {
        rasp[index] = {
          class: cl.class,
          cabinet: cl.cabinet,
          teacher: `${cl.t_sname} ${cl.t_fname} ${cl.t_tname}`,
          is_now: false
        }
      }
    }

    for (let i in shedule_data.groups) {
      const index = (ct.is_up ? 0 : 1) + (shedule_data.groups[i].id - 1) * 2 + (ct.time_id) * shedule_data.groups.length * 2 + ct.day_id * shedule_data.times.length * shedule_data.groups.length * 2
      if (rasp[index]) {
        rasp[index].is_now = true
      }
      else {
        rasp[index] = { is_now: true }
      }
    }

    res.render('table', { days: shedule_data.days, time: shedule_data.times, rasp: rasp, groups: shedule_data.groups, cur_day: ct.day_id });
  } catch (error) {
    console.error(error);
  }

})
router.get('/manage', ensureLogIn('/'), async (req, res) => {
  res.render('manage', { nick: JSON.stringify(req.session.passport.user) });
})

router.get('/meet',
  // ensureLogIn('/'),
  async (req, res) => {
    user = { role: 0 };

    if (req.session.passport)
      user = req.session.passport
    res.render('meet', req.session.passport);
  })

module.exports = router;
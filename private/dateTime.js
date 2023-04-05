'use strict'
const shedule_data = require('../private/db').stored_data

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
Date.prototype.getDayOfWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}


const setup_cur_time = () => {
  const cur_time = { day_id: -1, time_id: -1, is_up: false }
  const date = new Date();
  const day_of_week = date.getDay()
  const is_up = date.getWeek() % 2 == 1
  const now = date.getMinutes() + (date.getHours() * 60)

  cur_time.day_id = day_of_week - 1 == -1 ? 6 : day_of_week - 1
  cur_time.is_up = is_up
  // for (let t in )
  cur_time.time_id = -1

  for (let t in shedule_data.times) {
    let time = shedule_data.times[t]
    console.log()
    const is_now = now >= time.from_as_minuts - 5 && now < time.from_as_minuts + time.duration_as_minuts + 5
    if (is_now){
      cur_time.time_id = shedule_data.times[t]['id']
      break
    }
  }
  return cur_time
}

module.exports.setup_cur_time = setup_cur_time
'use strict'
const shedule_data = require('../private/db').stored_data
const TOO_SOON = -Infinity
const TOO_LATE = -1
const MINUTS_BETWEEN = 5

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}
Date.prototype.getDayOfWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}


const setup_cur_time = () => {

  const cur_time = { day_id: -1, time: -1, time_id: -1, is_up: false, class_is_over: false }
  const date = new Date();
  const day_of_week = date.getDay()
  const is_up = date.getWeek() % 2 == 0
  const now = date.getMinutes() + (date.getHours() * 60)

  cur_time.day_id = day_of_week - 1 == -1 ? 6 : day_of_week - 1
  cur_time.is_up = is_up
  cur_time.time = -1

  let start_day = shedule_data.times[0].from_as_minuts
  if (now < start_day - 5) {
      cur_time.time = TOO_SOON
    return cur_time
  }

  let prev = shedule_data.times[0]
  cur_time.time = 0
  for (let t = 1; t <= shedule_data.times.slice(1).length; t++) {
    let time = shedule_data.times[t]
    const is_now =
      (now + MINUTS_BETWEEN >= prev.from_as_minuts && now - MINUTS_BETWEEN < time.from_as_minuts) //&&
      // (now + MINUTS_BETWEEN >= time.from_as_minuts && now - MINUTS_BETWEEN < time.from_as_minuts + time.duration_as_minuts)
    if (is_now) {
      cur_time.class_is_over = now > prev.from_as_minuts + prev.duration_as_minuts
      cur_time.time_id = Number(shedule_data.times[t-1]['id'])
      cur_time.time = t-1
      return cur_time
    }
    prev = time
  }

  cur_time.time = TOO_LATE
  return cur_time
}

module.exports.setup_cur_time = setup_cur_time
module.exports.TOO_LATE = TOO_LATE
module.exports.TOO_SOON = TOO_SOON
module.exports.MINUTS_BETWEEN = MINUTS_BETWEEN
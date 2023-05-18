'use strict'

const logger = require('./logger')(__filename);

const shedule_data = require('../private/db').stored_data
const TOO_SOON = -Infinity
const TOO_LATE = -1
const MINUTS_BETWEEN = 5

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() - 1) / 7);
}


const setup_cur_time = () => {

  const cur_time = { day_id: -1, time: -1, time_id: -1, is_up: false }
  const date = new Date();
  const day_of_week = date.getDay()
  const is_up = date.getWeek() % 2 == 1
  const now = date.getMinutes() + (date.getHours() * 60)

  cur_time.day_id = day_of_week == 0 ? 7 : day_of_week
  cur_time.is_up = is_up
  cur_time.time = -1

  let start_day = shedule_data.times[0].from_as_minuts
  if (now < start_day - 5) {
    cur_time.time = TOO_SOON
    logger.verbose(`selected too soon time: ${JSON.stringify(cur_time)}`)
    return cur_time
  }

  let next = shedule_data.times[1]
  let is_now = false
  cur_time.time = 0
  for (let t = 0; t < shedule_data.times.slice(0, -1).length; t++) {
    let time = shedule_data.times[t]
    next = shedule_data.times[t + 1]
    is_now =
      (now + MINUTS_BETWEEN >= time.from_as_minuts && now + MINUTS_BETWEEN < next.from_as_minuts)
    if (is_now) {
      cur_time.time = t
      cur_time.time_id = Number(shedule_data.times[t]['id'])

      logger.verbose(`selected time: ${JSON.stringify(cur_time)}`)
      return cur_time
    }
  }
  if (!is_now) {
    is_now = (now + MINUTS_BETWEEN >= next.from_as_minuts && now - MINUTS_BETWEEN < next.from_as_minuts + next.duration_as_minuts)
    if (is_now) {
      cur_time.time = shedule_data.times.length - 1
      cur_time.time_id = Number(shedule_data.times[cur_time.time]['id'])
      logger.verbose(`selected last time: ${JSON.stringify(cur_time)}`)
      return cur_time
    }
  }

  cur_time.time = TOO_LATE
  logger.verbose(`selected too late time: ${JSON.stringify(cur_time)}`)
  return cur_time
}

module.exports.setup_cur_time = setup_cur_time
module.exports.TOO_LATE = TOO_LATE
module.exports.TOO_SOON = TOO_SOON
module.exports.MINUTS_BETWEEN = MINUTS_BETWEEN
'use strict'

require('dotenv').config();

const time = require('./dateTime')
const db = require('./db')
const shedule_data = require('./db').stored_data
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')

const appId = process.env.APPID;
const appCertificate = process.env.APPCERTIFICATE;

const uid = 0;
const role = RtcRole.PUBLISHER;



const generate_tokens = () => {
  const now_time_ids = time.setup_cur_time()

  db.get_classes(
    now_time_ids.day_id,
    Math.max(-1, now_time_ids.time),
    now_time_ids.is_up, (error, ret) => {
      const dt = new Date()
      const day_start = Math.floor(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime() / 1000)
      const cur_date = Date.now() / 1000

      console.log(ret)
      let duration = 0

      for (let r in ret) {
        const el = ret[r]
        const channel_name = `group-${el.group_id}`
        const privilegeExpiredTs = day_start + (el.from_as_minuts + el.duration + 5) * 60
        duration = Math.min(privilegeExpiredTs - cur_date, duration)

        const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channel_name, uid, role, privilegeExpiredTs);

        console.log(`${channel_name} ${tokenA}`)

      }

      if (duration == 0) {
        const next_day_start = day_start + 24 * 60 * 60
        if (now_time_ids.time != time.TOO_SOON && now_time_ids.time != time.TOO_LATE) {
          let time_id = now_time_ids.time + (now_time_ids.class_is_over ? 1 : 0)
          if (db.stored_data.times[time_id]) {
            let now = db.stored_data.times[time_id]
            duration = day_start * 1000 +
              (now.from_as_minuts) *
              60 * 1000
          } else
            now_time_ids.time = time.TOO_LATE
        }
        if (now_time_ids.time == time.TOO_SOON) {
          duration = day_start * 1000 + (db.stored_data.times[0].from_as_minuts - 5) * 60 * 1000
        } else if (now_time_ids.time == time.TOO_LATE) {
          duration = next_day_start * 1000 + (db.stored_data.times[0].from_as_minuts - 5) * 60 * 1000
        }
        duration -= time.MINUTS_BETWEEN * 1000 * 60
      }

      console.log(`New tokens ready: ${duration} ${new Date(duration)}\n${duration - Date.now()} [${now_time_ids.time}]`)
      setTimeout(() => { console.log(`${duration}`); generate_tokens() }, duration - Date.now())
    })
}


module.exports.generate_tokens = generate_tokens;

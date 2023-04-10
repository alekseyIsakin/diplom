'use strict'

require('dotenv').config();

const cur_time = require('./dateTime').setup_cur_time
const db = require('./db')
const shedule_data = require('./db').stored_data
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')

const appId = process.env.APPID;
const appCertificate = process.env.APPCERTIFICATE;

const uid = 0;
const role = RtcRole.PUBLISHER;



const generate_tokens = () => {
  const now_time_id = cur_time()
  const dt = new Date()
  const day_start = Math.floor(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime() / 1000)
  const cur_date = Date.now() / 1000

  db.get_classes(
    now_time_id.day_id,
    Math.max(-1, now_time_id.time_id),
    now_time_id.is_up, (error, ret) => {
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
        const next_day_start = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
        if (now_time_id.time_id == -Infinity) {
          duration = next_day_start + (db.stored_data.times[0].from_as_minuts - 5) * 60 * 1000
        } 
        if (now_time_id.time_id != -1) {
          duration = next_day_start + (db.stored_data.times[now_time_id.time_id + 1].from_as_minuts - 5) * 60 * 1000

        }
        db.stored_data
      }

      setTimeout(() => { console.log(`${duration}`); generate_tokens() }, duration)
    })
}


module.exports.generate_tokens = generate_tokens;

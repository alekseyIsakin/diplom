'use strict'

require('dotenv').config();

const dt = require('./dateTime')
const db = require('./db')
const shedule_data = require('./db').stored_data
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')

const appId = process.env.APPID;
const appCertificate = process.env.APPCERTIFICATE;

const uid = 0;
const role = RtcRole.PUBLISHER;
const currentTimestamp = Math.floor(Date.now() / 1000) + 3600



const generate_tokens = () => {
  const now = dt.cur_time
  let t = db.get_classes(now.day_id, now.time_id, now.is_up, (error, ret) => {
    console.log(ret)
    for (let r in ret) {
      const el = ret[r]
      const channel_name = `${now.day_id}-${now.time_id}-${Number(now.is_up)}-${el.group_id}-${el.class_id}`
      const privilegeExpiredTs =  currentTimestamp + el.duration * 60
      const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channel_name, uid, role, privilegeExpiredTs);
      console.log(`${channel_name} ${tokenA}`)
    }
  })
}
module.exports.generate_tokens = generate_tokens;

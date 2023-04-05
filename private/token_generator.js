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
const currentTimestamp = Math.floor(Date.now() / 1000) + 3600



const generate_tokens = () => {
  const now = cur_time()
  let t = db.get_classes(now.day_id, now.time_id, now.is_up, (error, ret) => {
    console.log(ret)
    let duration = 0
    for (let r in ret) {
      const el = ret[r]
      const channel_name = `group-${el.group_id}`
      // const privilegeExpiredTs =  currentTimestamp + el.duration * 60
      const privilegeExpiredTs = currentTimestamp + 60
      const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channel_name, uid, role, privilegeExpiredTs);
      duration = el.duration
      console.log(`${channel_name} ${tokenA}`)
    }
    if (duration == 0){
      const dt = Date.now()
      new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
    }
    setTimeout(() => { console.log(Date.now()); generate_tokens() }, duration * 1000)
  })
}


module.exports.generate_tokens = generate_tokens;

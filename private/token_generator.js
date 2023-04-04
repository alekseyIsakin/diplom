'use strict'

require('dotenv').config();

const dt = require('./dateTime')
const db = require('./db')
const shedule_data = require('./db').stored_data
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')

const appId = process.env.APPID;
const appCertificate = process.env.APPCERTIFICATE;

const channelName = 'MyMyChannel2';
const uid = 0;
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 60
const currentTimestamp = Math.floor(Date.now() / 1000)
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
// Build token with uid

// const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);



const generate_tokens = () => {
  
  let t = db.get_classes(dt.cur_time.day_id, dt.cur_time.time_id, dt.cur_time.is_up, (error, ret) => {
    console.log(ret)
  })
}
module.exports.generate_tokens = generate_tokens;

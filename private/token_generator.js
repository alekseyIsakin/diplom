'use strict'

require('dotenv').config();

const time = require('./dateTime')
const db = require('./db')
const { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } = require('agora-access-token')
const logger = require('./logger')(__filename);

const appId = process.env.APPID;
const appCertificate = process.env.APPCERTIFICATE;

const uid = 0;
const role = RtcRole.PUBLISHER;


const generate_tokens = () => {
	const now_time_ids = time.setup_cur_time()

	db.get_classes(
		now_time_ids.day_id,
		Math.max(-1, now_time_ids.time_id),
		now_time_ids.is_up, (error, ret) => {
			const dt = new Date()
			const day_start = Math.floor(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime() / 1000)
			const cur_date = Date.now() / 1000
			const tokens = []

			logger.info(`Active channels: [ ${ret.length} ]`)
			let duration = 0

			for (let r in ret) {
				const el = ret[r]
				const channel_name = `group-${el.group_id}`
				const privilegeExpiredTs = day_start + (el.from_as_minuts + el.duration + 5) * 60
				duration = Math.min(privilegeExpiredTs - cur_date, duration)

				const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channel_name, uid, role, privilegeExpiredTs);

				tokens.push({
					class_id: el.class_id,
					group_id: el.group_id,
					token: tokenA,
					channel_name: channel_name
				})

				logger.verbose(`Token for: [ ${channel_name} ${tokenA} ]`)
			}
			db.upload_new_tokens(tokens, (error, row_cnt) => {
				if (!error)
					logger.info(`tokens have been updated [ ${row_cnt} ]`)
			})

			if (duration <= 0) {
				const next_day_start = day_start + 24 * 60 * 60

				if (now_time_ids.time != time.TOO_SOON && now_time_ids.time != time.TOO_LATE) {
					let time_id = now_time_ids.time
					if (db.stored_data.times[time_id]) {
						let now = db.stored_data.times[time_id]
						duration = day_start +
							(now.from_as_minuts + now.duration_as_minuts + 10) * 60
						duration *= 1000
					} else
						now_time_ids.time = time.TOO_LATE
				}
				if (now_time_ids.time == time.TOO_SOON) {
					duration = day_start * 1000 + (db.stored_data.times[0].from_as_minuts) * 60 * 1000
				} else if (now_time_ids.time == time.TOO_LATE) {
					duration = next_day_start * 1000 + (db.stored_data.times[0].from_as_minuts) * 60 * 1000
				}
				duration -= time.MINUTS_BETWEEN * 1000 * 60
			}

			logger.info(`New tokens ready [ ${tokens.length} ]
	next generation in [ ${(new Date(duration)).toLocaleString()} ];
	duration: [ ${duration - Date.now()} ]
	time_id:  [ ${now_time_ids.time_id} ]`)

			if (duration - Date.now() < 0) {
				logger.error(`Bad time duration [ ${duration} - ${Date.now()} ]=[ ${duration - Date.now()} ]`)
				throw new Error('Bad time duration')
			}
			setTimeout(() => { generate_tokens() }, duration - Date.now())
		})
}


module.exports.generate_tokens = generate_tokens;
 
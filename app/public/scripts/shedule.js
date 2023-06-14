const group_id = [];
document.cookie.split(';')
	.some((el, index) => {
		const v = el.split('=')
		if (v[0].endsWith('group_id')) {
			// '%26' is encoded '&'
			if (v[1] == "")
				return false
			v[1]
				.split('%26')
				.some(el => { group_id.push(Number(el)) })
			return false
		}
	})
let tmp = -1
document.cookie.split(';')
	.some((el, index) => {
		const v = el.split('=')
		if (v[0].endsWith('user_id')) {
			tmp = Number(v[1])
			return true
		}
	})

const user_id = tmp;

const get_day = (dt) => {
	return (dt.getDay() - 1 == -1 ? 6 : dt.getDay() - 1) + 1
}
const getMonday = (d) => {
	d = new Date(d);
	const day = d.getDay(),
		diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
	const m = new Date(d.setDate(diff))
	m.setHours(0)
	m.setMinutes(0)
	m.setSeconds(0)
	return m
}
const MONDAY = getMonday(Date.now())
const CUR_DAY = get_day(new Date())
const CUR_DATE = new Date()
const WEEK_DURATION = 7 * 24 * 60 * 60 * 1000
const MONDAY_START_MINUTS = Math.floor(MONDAY.getTime() / (60 * 1000))

// var APPLICATION_SERVER_URL = "https://w0m0site.freemyip.com/";
var APPLICATION_SERVER_URL = "http://192.168.3.4:8000/";


$(function () {
	const from = Math.floor(MONDAY.getTime() / (60 * 1000))
	const to = Math.floor(from + WEEK_DURATION / (60 * 1000))
	const teacher_id = group_id.length == 0 ?
		user_id : NaN
	const g_id = group_id.length == 0 ?
		[null] : group_id

	load_shedule(
		g_id,
		teacher_id,
		from,
		to)
		.then(res => {
			res.forEach(cls => { classes_to_ui(cls) })
			show_all_shedule()

			$(".el").on("click", (e) => {
				const cur_element = e.currentTarget
				const day_id = cur_element.parentNode.parentNode.id

				if (cur_element.classList.contains('el_selected')) {
					cur_element.classList.remove('el_selected')
					$(`#${day_id} .el`).removeClass('el_hidden')
					show_shedule_in_day(day_id)
				} else {
					$(`#${day_id} .el`).addClass('el_hidden')
					$(`#${day_id} .el`).removeClass('el_selected')
					$(`#${day_id} .el`).removeAttr('style')
					$(`#${day_id} .el`).css({
						'max-height': '100%',
						'height': '100%',
						'top': '0%',

					})
					cur_element.classList.remove('el_hidden')
					cur_element.classList.add('el_selected')
				}
			})
		})
		.catch(err => { alert(JSON.stringify(err)) })
	update_background()
	setInterval(update_background, 60 * 1000)
})
const update_background = () => {
	const date = new Date()
	const cur_time = Math.abs(100 - (date.getMinutes() + date.getHours() * 60) / 14.40)
	const r = `linear-gradient(
		0deg, 
		rgba(0,0,0,0) 0%, 
		rgba(0,0,0,0) ${cur_time - .5}%, 
		rgb(255, 0, 0) ${cur_time}%, 
		rgba(0,0,0,0) ${cur_time + .5}%, 
		rgba(0,0,255,0) 100%), 
	repeating-linear-gradient(
		#ffffff,
		#ffffff 3.8%, 
		#b0b0b0 4.167%,
		#b0b0b0 8.334%)`
	$(`#day${CUR_DAY} .classes`).css({ 'background': r })
}

const show_all_shedule = () => {
	$(`.el`).each(function () {
		$(this).css({
			'top': $(this).attr('top'),
			'max-height': $(this).attr('height'),
			'height': $(this).attr('height')
		})
	})
}
const show_shedule_in_day = (day_id) => {
	$(`#${day_id} .el`).each(function () {
		$(this).css({
			'top': $(this).attr('top'),
			'max-height': $(this).attr('height'),
			'height': $(this).attr('height')
		})
	})
}

const load_shedule = (group_id, teacher_id, from, to) => {
	return new Promise((resolve, reject) => {
		$.ajax({
			type: 'GET',
			url: APPLICATION_SERVER_URL + 'db/shedule',
			data: { group_id: group_id, from: from, to: to },
			headers: { "Content-Type": "application/json" },
			success: (response) => resolve(response),
			error: (error) => reject(error)
		});
	});
}

const classes_to_ui = (cls) => {
	// console.log(JSON.stringify(cls))
	const dt = new Date((cls.start) * 60 * 1000)
	const day = get_day(dt)
	// console.log(JSON.stringify(dt - MONDAY))
	const time_offset = -MONDAY.getTimezoneOffset()

	// console.log(dt)
	if ((dt - MONDAY) < WEEK_DURATION && (dt - MONDAY) > 0) {
		// total minuts => minuts in cur day => percent
		const from = (time_offset + cls.start % (24 * 60)) / 14.40
		const duration = cls.duration_minuts / 14.40
		const div = document.createElement('div')
		// console.log(from, duration)
		const teacher = `${cls.second_name} ${cls.first_name[0]}. ${cls.thrid_name[0]}.`

		const brief = document.createElement('span')
		const info = document.createElement('div')
		const info_class = document.createElement('p')
		const info_teacher = document.createElement('p')
		const info_start = document.createElement('p')
		const info_duration = document.createElement('p')
		const info_group = document.createElement('p')

		div.setAttribute('top', from + '%')
		div.setAttribute('height', duration + '%')

		div.classList.add('el')
		div.classList.add('el1')

		brief.className = 'brief'
		info.className = 'info'
		console.log(group_id)

		brief.textContent = `${ group_id.length == 0 ? cls.group_title : teacher} | ${cls.class_title}`

		info_class.textContent = `Предмет: ${cls.class_title}\n`
		info_teacher.textContent = `Преподаватель: ${teacher}\n`
		info_start.textContent = `Начало: ${dt.toLocaleString()}\n`
		info_duration.textContent = `Продолжительность: ${cls.duration_minuts} мин\n`
		info_group.textContent = `Группа: ${cls.group_title}\n`

		info.appendChild(info_class)
		info.appendChild(info_teacher)
		info.appendChild(info_start)
		info.appendChild(info_duration)
		info.appendChild(info_group)

		div.appendChild(info)
		div.appendChild(brief)

		$(`#day${day} .classes`).append(div)
	}
}

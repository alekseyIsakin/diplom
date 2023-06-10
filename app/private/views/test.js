$(document).ready((e) => {
	console.log('hi')
	show_all_shedule()
	
	$(".hours").each(function (el) {
		for (let i = 0; i < 24; i++)
			$(this).append(`<div>${i}</div>`)
	})

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
				'height': '100%',
				'top': '0%',
				
			})
			cur_element.classList.remove('el_hidden')
			cur_element.classList.add('el_selected')
		}
	})
})

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
$(document).ready((e) => {
	console.log('hi')
	show_all_shedule()

	$(".hours").each(function (el) {
		for (let i = 0; i < 24; i++)
			$(this).append(`<div>${i}</div>`)
	})

	$(".el").on("click", (e) => {
		const cur_element = e.currentTarget

		if (cur_element.classList.contains('el_selected')) {
			cur_element.classList.remove('el_selected')
			$(".el").removeClass('el_hidden')
			show_all_shedule()
		} else {
			$(".el").addClass('el_hidden')
			$(".el").removeClass('el_selected')
			$(".el").removeAttr('style')

			cur_element.classList.remove('el_hidden')
			cur_element.classList.add('el_selected')
		}
	})
})

const show_all_shedule = () => {
	$(".el").each(function () {
		$(this).css({
			'top': $(this).attr('top'),
			'max-height': $(this).attr('height'),
			'height': $(this).attr('height')
		})
	})
}
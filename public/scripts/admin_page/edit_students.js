'use strict'


const new_users = []
let loaded_users = []
let default_offset = 5
let loaded_users_page = 0

const get_user = () => {
	const new_user = {}
	new_user['nick'] = document.querySelector(`#nick`).value
	new_user['f_name'] = document.querySelector(`#f_name`).value
	new_user['s_name'] = document.querySelector(`#s_name`).value
	new_user['t_name'] = document.querySelector(`#t_name`).value
	new_user['password'] = document.querySelector(`#password`).value
	new_user['id'] = -1
	return new_user
}

const del_user = (nick) => {
	const index = new_users.findIndex((val) => val.nick == nick)
	console.log(`remove user [${new_users[index].nick}]`)
	new_users.splice(index, 1)
}

const register_new_user = (user, user_appear) => {
	const users_holder = document.querySelector(`#edited_users`)
	new_users.push(user)
	users_holder.appendChild(user_appear)
}

const unic_check = (user) => {
	return !new_users.find((val) => val.nick == user.nick)
}

const create_user_appear = (user) => {
	const div = document.createElement('div')

	const id = document.createElement('label')
	const nick = document.createElement('label')
	const f_name = document.createElement('label')
	const s_name = document.createElement('label')
	const t_name = document.createElement('label')
	const password = document.createElement('label')
	const del = document.createElement('button')
	div.id = user.nick

	id.textContent = user.id
	nick.textContent = user.nick
	f_name.textContent = user.f_name
	s_name.textContent = user.s_name
	t_name.textContent = user.t_name
	password.textContent = '***'
	del.textContent = 'DEL'

	del.addEventListener('click', (event) => {
		del_user(div.id)
		div.remove();
	})


	div.appendChild(id)
	div.appendChild(nick)
	div.appendChild(f_name)
	div.appendChild(s_name)
	div.appendChild(t_name)
	div.appendChild(password)
	div.appendChild(del)
	return div
}

const fill_loaded_users = (users) => {
	console.log(users[ROLES.student])
	console.log(users[ROLES.teacher])
	console.log(users[ROLES.admin])
}

const append_existing_student = (s) => {
	const users_holder = document.querySelector(`#users`)

}

const get_users = async (from, to) => {
	const url = `/admin/get_users/${ROLES.student}/${from}/${to}/`
	console.log(`[${url}]`)
	return fetch(url)
		.then(response => response.json())
}

const send_users = async () => {
	let response = await fetch('/admin/new_users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(user)
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const btn_add = document.querySelector(`#btn_append_user`)
	const btn_next_users = document.querySelector(`#users_load_next`)
	const btn_prev_users = document.querySelector(`#users_load_prev`)

	btn_add.addEventListener('click', () => {
		const user = get_user()
		if (unic_check(user) == false) {
			alert('unic check failure')
			return
		}
		const user_appear = create_user_appear(user)
		register_new_user(user, user_appear)
	})

	btn_next_users.addEventListener('click', () => {
		const start = loaded_users_page * default_offset
		const offset = (loaded_users_page + 1) * default_offset
		loaded_users_page += 1

		get_users(start, offset)
			.then(users => {
				loaded_users = users[ROLES.student]
				if (loaded_users.length > 0) {
					add_loaded_users(loaded_users)
				} else {
					loaded_users_page -= 1
				}
				console.log(`page [${loaded_users_page}]`)
			})
	})

	btn_prev_users.addEventListener('click', () => {
		loaded_users_page -= 1
		const start = (loaded_users_page - 1) * default_offset
		const offset = (loaded_users_page) * default_offset
		if (start < 0) {
			loaded_users_page = 1
			return
		}

		get_users(start, offset)
			.then(users => {
				loaded_users = users[ROLES.student]
				add_loaded_users(loaded_users)
				console.log(`page [${loaded_users_page}]`)
			})
	})
})

const add_loaded_users = (users) => {
	const user_holder = document.querySelector(`#loaded_users`)
	user_holder.textContent = ''

	users.forEach(user => {
		const div = create_user_appear(user)
		user_holder.appendChild(div)
	})
}
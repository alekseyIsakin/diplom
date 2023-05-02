'use strict'

const new_users = []

const get_user = () => {
	const new_user = {}
	new_user['nick'] = document.querySelector(`#nick`).value
	new_user['f_name'] = document.querySelector(`#f_name`).value
	new_user['s_name'] = document.querySelector(`#s_name`).value
	new_user['t_name'] = document.querySelector(`#t_name`).value
	new_user['password'] = document.querySelector(`#password`).value
	new_user['role'] = document.querySelector(`input[name=role]:checked`).value
	return new_user
}

const del_user = (nick) => {
	const index = new_users.findIndex((val) => val.nick == nick)
	console.log(`remove user [${new_users[index].nick}]`)
	new_users.splice(index, 1)
}

const register_new_user = (user, user_appear) => {
	const users_holder = document.querySelector(`#users`)
	new_users.push(user)
	users_holder.appendChild(user_appear)
}

const unic_check = (user) => {
	return !new_users.find((val) => val.nick == user.nick)
}


const create_user_appear = (user) => {
	const div = document.createElement('div')

	const nick = document.createElement('label')
	const f_name = document.createElement('label')
	const s_name = document.createElement('label')
	const t_name = document.createElement('label')
	const password = document.createElement('label')
	const role = document.createElement('label')
	const del = document.createElement('button')
	div.id = user.nick

	nick.textContent = user.nick
	f_name.textContent = user.f_name
	s_name.textContent = user.s_name
	t_name.textContent = user.t_name
	password.textContent = '***'
	role.textContent = user.role
	del.textContent = 'DEL'
	del.addEventListener('click', () => {
		del_user(user.nick)
		div.remove()
	})


	div.appendChild(nick)
	div.appendChild(f_name)
	div.appendChild(s_name)
	div.appendChild(t_name)
	div.appendChild(password)
	div.appendChild(role)
	div.appendChild(del)
	return div
}

const get_users = async () => {
	let response = await fetch('/admin_page/get_users')
}
const send_users = async () => {
	let response = await fetch('/admin_page/new_users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body: JSON.stringify(user)
	});
}

document.addEventListener("DOMContentLoaded", () => {
	const app_btn = document.querySelector(`#btn_append_user`)
	app_btn.addEventListener('click', () => {
		const user = get_user()
		if (unic_check(user) == false) {
			alert('unic check failure')
			return
		}
		const user_appear = create_user_appear(user)
		register_new_user(user, user_appear)
	})
})
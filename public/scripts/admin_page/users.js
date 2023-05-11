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
	const users_holder = document.querySelector(`#edited_users`)
	new_users.push(user)
	users_holder.appendChild(user_appear)
}

const unic_check = (user) => {
	return !new_users.find((val) => val.nick == user.nick)
}

// on_delete (user)
const create_user_appear = (user, on_delete) => {
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

	del.addEventListener('click', (user) => { 
		div.remove; 
		on_delete(user) 
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

const fill_loaded_users = (users) => {
	console.log(users[ROLES.student])
	console.log(users[ROLES.teacher])
	console.log(users[ROLES.admin])
}

const append_existing_student = (s) => {
	const users_holder = document.querySelector(`#users`)

}

const get_users = async () => {
	fetch('/admin/get_users')
		.then(response => response.json())
		.then(users => fill_loaded_users(users))
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
	const btn_get_users = document.querySelector(`#get_users`)
	btn_add.addEventListener('click', () => {
		const user = get_user()
		if (unic_check(user) == false) {
			alert('unic check failure')
			return
		}
		const user_appear = create_user_appear(
			user,
			(user) => {
				del_user(user.nick)
			})
		register_new_user(user, user_appear)
	})
	btn_get_users.addEventListener('click', () => {
		const users = get_users()

	})
})
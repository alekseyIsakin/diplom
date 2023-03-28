'use strict'

const express = require('express')
const app = express()
const path = require('path')
const port = 80

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "public/views"));

const { pool } = require('./db')

app.post('/login', async (req,res) => {
	console.log(`${req.body.nick} ${req.body.password}`)
	
})
app.get('/', async (req,res) => {
	try{
		const res_query = await pool.query(
			"select * from users"
		);
		let t = res_query.rows[0]
		console.log(`receive ${t.nick}`)
		// res.send(res_query.rows)
		res.render('index', {users: res_query.rows});
	} catch (error) {
		res.send(error)
		console.error(error)
	}

})


app.listen(port, ()=>console.log('serrver has been started'))

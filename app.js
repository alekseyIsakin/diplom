const express = require('express')

const app = express()

app.get('/', (req,res) => {
	res.send('server\n')
})


app.listen(3000, ()=>console.log('serrver has been started'))

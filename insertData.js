const { pool } = require('./db')

async function insertData(){
	const [nick, passw] = process.argv.slice(2);
	try{
		const res = await pool.query(
			"call add_new_user($1::TEXT, $2::TEXT, $3::TEXT, $4::TEXT, $5::TEXT)",
			[nick, 'f', 's', 't', passw]
		);
		console.log(`added ${nick}`)
	} catch (error) {
		console.error(error)
	}
}

insertData();

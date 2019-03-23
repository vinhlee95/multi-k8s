// Postgres client
const { Pool } = require('pg')
const keys = require('./keys')

const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort,
})

pgClient.on('error', (error) => console.log(error))

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
	.catch(error => console.log(error))

module.exports = {
	pgClient,
}
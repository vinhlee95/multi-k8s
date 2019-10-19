const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pgClient } = require('./db')
const { redisClient, redisPublisher } = require('./redis-client')

// Express
const app = express();
app.use(cors())
app.use(bodyParser.json())

app.get('/api/', (req, res) => 'Welcome to Fibo')

app.get('/api/values', async (req, res) => {
	const values = await pgClient.query('SELECT * FROM values');
	res.status(200).send(values.rows)
})

app.get('/api/values/current', async (req, res) => {
	redisClient.hgetall('values', (error, values) => {
		if(error) {
			res.status(500).send(error);
		}

		res.status(200).send(values)
	})
})

app.post('/api/values', async (req, res) => {
	const {index} = req.body

	if(parseInt(index) > 40) {
		res.status(422).send('Index is too high')
	}

	// trigger redis worker to do the calculation
	redisClient.hset('values', index, 'nothing')
	redisPublisher.publish('insert', index)

	// update db
	await pgClient.query('INSERT INTO values(number) VALUES ($1)', [index])

	res.status(200).send({index})
})

app.listen(3003, () => console.log('App is listening on port 3003'))
import React, { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
	const [seenIndexes, setSeenIndexes] = useState([])
	const [values, setValues] = useState({})
	const [index, setIndex] = useState('')

	useEffect(() => {
		const fetchSeenIndexes = async () => {
			const seenIndexes = await axios.get('/api/values')
			setSeenIndexes(seenIndexes.data)
		}

		fetchSeenIndexes()
	}, [])

	useEffect(() => {
		const fetchValues = async () => {
			const values = await axios.get('/api/values/current')
			setValues(values.data)
		}

		fetchValues();
	}, [])

	const handleSubmit = async (e) => {
		e.preventDefault();
		await axios.post('/api/values', {index})
		setIndex('')
	}

	const renderSeenIndexes = () => seenIndexes.map((seenIndex, index) => (
		<div key={index}>{seenIndex}</div>
	))

	const renderValues = () => console.log(values)

	return(
		<form onSubmit={handleSubmit}>
			<h1>Fib calculator</h1>
			<input
				value={index}
				onChange={(e) => setIndex(e.target.value)}
			/>
			<button type='submit' onClick={handleSubmit}>
				Submit
			</button>
			{renderSeenIndexes()}
			{renderValues()}
		</form>
	)
}

export default App

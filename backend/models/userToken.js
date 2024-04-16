const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
	id: String,
	token: String,
	expiry: String,
})

const token = mongoose.model('token', tokenSchema)

module.exports = token

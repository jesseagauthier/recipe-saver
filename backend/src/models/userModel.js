const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	id: String,
	given_name: String,
	family_name: String,
	email: String,
	picture: String,
})

const User = mongoose.model('User', userSchema)

module.exports = User

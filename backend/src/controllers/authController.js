const User = require('../models/userModel')
const tokenService = require('../services/tokenService')

const login = async (req, res) => {
	try {
		// Check if a user with the given ID or email already exists
		const existingUser = await User.findOne({
			$or: [{ id: req.body.id }, { email: req.body.email }],
		})

		// Generate a session token
		const token = await tokenService.generateSessionToken(req.body)

		if (existingUser) {
			// Send the token in the response if the user exists
			return res.status(202).json({ message: 'User logged in', token: token })
		}

		// If the user does not exist, create a new user
		const newUser = new User(req.body)
		await newUser.save()

		res.status(201).json({ message: 'Successfully Registered', token: token })
	} catch (error) {
		console.error('Error in login/register:', error)
		res.status(500).json({ message: error.message })
	}
}

module.exports = {
	login,
}

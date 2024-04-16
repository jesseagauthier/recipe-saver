// Function that accepts a body req that includes a user ID that is generated from Kinde
const User = require('../models/userModel')

const createUser = async (req, res) => {
	try {
		const userInfo = req.body
		// Ensure the model name used here matches your import and schema definition
		const duplicate = await User.findOne({ id: userInfo.id })

		if (duplicate) {
			return res.status(202).json({ message: 'User already exists' })
		}

		const userInstance = new User(userInfo)
		await userInstance.save()

		res.status(201).json({
			message: 'User created successfully',
			user: {
				id: userInstance.id,
			},
		})
	} catch (error) {
		console.error('Error in Creating User:', error)
		res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		})
	}
}

module.exports = {
	createUser,
}

// Create a function that 1) Checks the database for duplicate user id/email
// 2) If a user exist return 202 - User already exist
// 3) If !=user create a database entry that match above Modal
// 4) Return 201 - User created

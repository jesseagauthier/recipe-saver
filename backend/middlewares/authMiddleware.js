const SessionTokens = require('../models/userToken')

const verifyToken = async (req, res, next) => {
	const clientAuthToken = req.headers['client-auth-token']

	if (!clientAuthToken) {
		return res
			.status(401)
			.json({ message: 'Unauthorized: Missing Client-Auth-Token' })
	}

	const userId = req.body.userId
	if (!userId) {
		return res.status(400).json({ message: 'Bad Request: Missing User ID' })
	}

	try {
		const existingToken = await SessionTokens.findOne({
			token: clientAuthToken,
		})
		console.log(existingToken)
		if (!existingToken || existingToken.token !== clientAuthToken) {
			return res
				.status(401)
				.json({ message: 'Unauthorized: Invalid Client-Auth-Token' })
		}

		next()
	} catch (error) {
		console.error('Error in token verification:', error)
		res.status(500).json({ message: 'Internal Server Error' })
	}
}

module.exports = {
	verifyToken,
}

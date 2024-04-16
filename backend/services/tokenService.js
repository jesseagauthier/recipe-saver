const SessionTokens = require('../models/userToken')

const generateRandomToken = () => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	const length = 18
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length))
	}
	return result
}

const generateSessionToken = async (user) => {
	try {
		const todaysDate = new Date()
		const existingToken = await SessionTokens.findOne({ id: user.id })

		if (!existingToken) {
			const newTokenString = generateRandomToken()
			const expiryDate = new Date()
			expiryDate.setDate(expiryDate.getDate() + 15) // Token expiry set for 15 days

			const newToken = new SessionTokens({
				id: user.id,
				token: newTokenString,
				expiry: expiryDate,
			})

			await newToken.save()
			return newTokenString
		} else {
			if (existingToken.expiry < todaysDate) {
				await SessionTokens.deleteOne({ id: user.id })
				return 'expired token'
			} else {
				return existingToken.token
			}
		}
	} catch (error) {
		console.error('Error generating session token:', error)
		throw error
	}
}

module.exports = {
	generateRandomToken,
	generateSessionToken,
}

const mongoose = require('mongoose')

exports.connectDB = async () => {
	try {
		const dbUsername = process.env.MONGO_DB_USERNAME
		const dbPassword = process.env.MONGO_DB_PASSWORD
		const dbName = 'RECIPESAVER'
		const uri = `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.nvcwwp3.mongodb.net/${dbName}?retryWrites=true&w=majority`

		await mongoose.connect(uri)
	} catch (e) {
		console.error('Error connecting to MongoDB', e)
		process.exit(1)
	}
}

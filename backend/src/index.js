require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const fs = require('fs')
const https = require('https')

const userRoutes = require('./routes/userRoutes')
const recipeRoutes = require('./routes/recipeRoutes')
const mealPlanRoutes = require('./routes/mealPlanRoutes')

const { connectDB } = require('./config/db')

const app = express()

const allowedOrigins = [
	'https://app.jessegauthier.dev',
	'https://localhost:5173',
	'http://localhost:5173',
]

const corsOptions = {
	origin: function (origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true) // Allow the request
		} else {
			callback(new Error('Not allowed by CORS')) // Disallow the request
		}
	},
	methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'], // Include other methods as needed
	allowedHeaders: ['Content-Type', 'Number'], // Specify allowed headers
	exposeHeaders: [
		'x-api-quota-request',
		'x-api-quota-used',
		'x-api-quota-left',
	], // Expose custom headers
	optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middlewares
app.use(cors(corsOptions))

app.use(express.json())
app.use(morgan(':date[iso] :method :url :status :response-time ms'))

// Database Connection
connectDB()

// Routes
app.use('/api/users', userRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/mealplanroutes', mealPlanRoutes)

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send('Something broke!')
})

// HTTPS Server Setup
const httpsOptions = {
	key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
	cert: fs.readFileSync(process.env.HTTPS_CERT_PATH),
}

const httpsServer = https.createServer(httpsOptions, app)

const port = process.env.PORT || 4000
httpsServer.listen(port, () => {
	console.log(`HTTPS Server is running on port ${port}`)
})

app.get('/', (req, res) => {
	res.send('unauthorized')
})

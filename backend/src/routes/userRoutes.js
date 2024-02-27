const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const UserController = require('../controllers/userController')

// Route for user login
router.post('/login', authController.login)

router.post('/new-user', UserController.createUser)

module.exports = router

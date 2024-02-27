const express = require('express')
const router = express.Router()

const mealPlanController = require('../controllers/mealPlanController')
const authMiddleware = require('../middlewares/authMiddleware')

// Route to save a recipe
router.post('/savemeal', mealPlanController.saveMealPlan)
router.post('/getmealplansforweek', mealPlanController.getMealPlansForWeek)

module.exports = router

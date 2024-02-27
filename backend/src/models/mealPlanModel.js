const mongoose = require('mongoose')

const MealPlanSchema = new mongoose.Schema(
	{
		userId: String,
		date: String,
		meal: {
			type: String,
			enum: ['breakfast', 'lunch', 'dinner', 'snack'],
		},
		recipeId: String,
		image: String,
		title: String,
	},
	{ strict: true }
)

const mealPlan = mongoose.model('MealPlan', MealPlanSchema)

module.exports = mealPlan

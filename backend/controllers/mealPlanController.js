const MealPlan = require('../models/mealPlanModel') // Ensure correct import naming
const mongoose = require('mongoose')

const allowedMeals = ['breakfast', 'lunch', 'dinner', 'snack']

const saveMealPlan = async (req, res) => {
	console.log('Received request to save meal plan:', req.body)
	try {
		const mealPlanData = req.body.query
		const { userId, date, meal, recipeId, image, title } = mealPlanData

		if (!allowedMeals.includes(meal)) {
			console.error('Validation Error: Invalid meal type provided', {
				meal,
				allowedMeals,
			})
			return res.status(400).json({
				message: `Invalid meal type. Allowed meal types are: ${allowedMeals.join(
					', '
				)}.`,
			})
		}

		const filter = { userId, date, meal }
		const update = { userId, date, meal, recipeId, image, title }
		const options = { new: true, upsert: true }

		const updatedMealPlan = await MealPlan.findOneAndUpdate(
			filter,
			update,
			options
		)

		res.status(200).json({
			message: 'Meal plan saved successfully',
			mealPlan: updatedMealPlan,
		})
	} catch (error) {
		console.error('Error in saving meal plan:', {
			errorMessage: error.message,
			errorStack: error.stack,
			requestBody: req.body,
		})
		res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		})
	}
}

const getMealPlansForWeek = async (req, res) => {
	console.log('Received request to get meal plans for week:', req.body)
	try {
		const { userId, startDate, endDate } = req.body // Extract userId, startDate, and endDate from request body

		// Validate the input date formats, optional but recommended
		if (
			!/^\d{2}\/\d{2}\/\d{4}$/.test(startDate) ||
			!/^\d{2}\/\d{2}\/\d{4}$/.test(endDate)
		) {
			return res.status(400).json({
				message: 'Invalid date format. Expected MM/DD/YYYY.',
			})
		}

		const queryStartDate = startDate
		const queryEndDate = endDate

		// Find all meal plans for the given userId within the date range
		const mealPlans = await MealPlan.find({
			userId,
			date: {
				$gte: queryStartDate,
				$lte: queryEndDate,
			},
		})

		if (mealPlans.length === 0) {
			return res.status(404).json({
				message: 'No meal plans found for the specified week.',
			})
		}

		res.status(200).json({
			message: 'Meal plans retrieved successfully',
			mealPlans,
		})
	} catch (error) {
		console.error('Error in retrieving meal plans for week:', {
			errorMessage: error.message,
			errorStack: error.stack,
			requestBody: req.body,
		})
		res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		})
	}
}

const deleteMealPlan = async (req, res) => {
	console.log('Received request to delete meal plan:', req.body)
	try {
		const { userId, date, recipeId } = req.body.query

		const filter = { userId, date, recipeId }

		// Use deleteOne or findOneAndDelete method to delete the meal plan
		const deletedMealPlan = await MealPlan.findOneAndDelete(filter)

		if (!deletedMealPlan) {
			return res.status(404).json({
				message: 'Meal plan not found or already deleted.',
			})
		}

		res.status(200).json({
			message: 'Meal plan deleted successfully',
		})
	} catch (error) {
		console.error('Error in deleting meal plan:', {
			errorMessage: error.message,
			errorStack: error.stack,
			requestBody: req.body,
		})
		res.status(500).json({
			message: 'Internal Server Error',
			error: error.message,
		})
	}
}

module.exports = {
	saveMealPlan,
	getMealPlansForWeek,
	deleteMealPlan,
}

const axios = require('axios')
const Recipe = require('../models/recipeModel')

const RAPIDAPIURI = process.env.RAPID_API_URI
const apiKey = process.env.RAPID_API_KEY

const getTrendingRecipes = async (req, res) => {
	const options = {
		method: 'GET',
		url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random',
		params: {
			number: '30',
		},
		headers: {
			'X-RapidAPI-Key': `${apiKey}`,
			'X-RapidAPI-Host': `${RAPIDAPIURI}`,
		},
	}

	try {
		const response = await axios.request(options)

		res.status(200).json(response.data)
	} catch (error) {
		console.error(error).status(500).json({
			message: 'Error fetching trending recipes',
			error: error.toString(),
		})
	}
}

const saveRecipe = async (req, res) => {
	console.log('save recipe', req.body)
	try {
		const recipeData = req.body
		const duplicate = await Recipe.findOne({ id: recipeData.id })
		if (duplicate) {
			return res.status(409).json({ message: 'Duplicate recipe' })
		}
		const newRecipe = new Recipe(recipeData)
		await newRecipe.save()
		res
			.status(201)
			.json({ message: 'Recipe saved successfully', recipe: newRecipe })
	} catch (error) {
		console.error('Error in saving recipe:', error)
		res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message })
	}
}

const deleteRecipe = async (req, res) => {
	try {
		const recipeId = req.params.id
		const recipe = await Recipe.findOne({ id: recipeId })
		if (!recipe) {
			return res.status(404).json({ message: 'Recipe not found' })
		}
		await Recipe.deleteOne({ _id: recipe._id })
		res.status(200).json({ message: 'Recipe deleted successfully' })
	} catch (error) {
		console.error('Error in deleting recipe:', error)
		res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message })
	}
}

const fetchSavedRecipes = async (req, res) => {
	try {
		const userId = req.body.userId
		const recipes = await Recipe.find({ userId: userId })
		if (recipes.length === 0) {
			return res.status(404).json({ message: 'No recipes found for this user' })
		}
		res
			.status(200)
			.json({ message: 'Recipes retrieved successfully', recipes: recipes })
	} catch (error) {
		console.error('Error in retrieving recipes:', error)
		res
			.status(500)
			.json({ message: 'Internal Server Error', error: error.message })
	}
}

const searchForRecipes = async (req, res) => {
	const searchTerm = req.body.searchTerm

	const options = {
		method: 'GET',
		url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
		params: {
			query: searchTerm,
		},
		headers: {
			'X-RapidAPI-Key': apiKey,
			'X-RapidAPI-Host': RAPIDAPIURI,
		},
	}
	console.log(searchTerm)
	try {
		const response = await axios.request(options)
		res.json(response.data) // Send the data part of the response to the client
	} catch (error) {
		console.error('Error fetching recipes:', error)
		if (error.response) {
			// Spoonacular API responded with a status code outside the 2xx range
			console.error('Data:', error.response.data)
			console.error('Status:', error.response.status)
			console.error('Headers:', error.response.headers)
			// Forward the status code from Spoonacular API to the client
			res.status(error.response.status).send(error.response.data)
		} else if (error.request) {
			// The request was made but no response was received
			console.error('Request:', error.request)
			res.status(500).send('No response from Spoonacular API')
		} else {
			// Something else caused an error
			console.error('Error Message:', error.message)
			res.status(500).send('An error occurred while fetching recipes')
		}
	}
}

const fetchFullRecipes = async (req, res) => {
	try {
		// Extract recipeId from the request body
		const recipeId = req.body.query // Assuming recipeId is sent in the request body under the key 'query'
		if (!recipeId) {
			return res.status(400).send('Recipe ID is missing')
		}

		// Define options for the Axios request
		const options = {
			method: 'GET',
			url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`,
			headers: {
				'X-RapidAPI-Key': `${apiKey}`,
				'X-RapidAPI-Host': `${RAPIDAPIURI}`,
			},
		}

		// Make the request using the options object
		const response = await axios.request(options)
		// Send the response data back to the client
		res.json(response.data)
	} catch (error) {
		console.error('Error fetching recipes:', error)
		res.status(500).send('An error occurred while fetching recipes')
	}
}

module.exports = {
	getTrendingRecipes,
	saveRecipe,
	deleteRecipe,
	fetchSavedRecipes,
	searchForRecipes,
	fetchFullRecipes,
}

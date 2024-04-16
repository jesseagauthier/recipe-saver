const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
	{
		id: String,
		image: String,
		imageType: String,
		title: String,
		userId: String,
	},
	{ strict: false }
)

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe

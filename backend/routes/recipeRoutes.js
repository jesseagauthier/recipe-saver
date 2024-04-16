const express = require('express')
const router = express.Router()

const recipeController = require('../controllers/recipeController')
const authMiddleware = require('../middlewares/authMiddleware')

// Route to get trending recipes
router.post('/trending', recipeController.getTrendingRecipes)

// Route to save a recipe
router.post('/save', recipeController.saveRecipe)

// Route to delete a recipe
router.delete('/delete/:id', recipeController.deleteRecipe)

// Route to fetch saved recipes
router.post('/fetch', recipeController.fetchSavedRecipes)

// Route to search for recipes
router.post('/search', recipeController.searchForRecipes)

router.post('/getRecipe', recipeController.fetchFullRecipes)

// Route to save user ID

module.exports = router

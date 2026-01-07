import express from 'express';
import {
  searchRecipes,
  searchByIngredients,
  generateAIRecipe,
  getRandomRecipe,
  getRecipeById,
  createRecipe
} from '../controllers/recipeController.js'; 
import { authenticate } from '../middleware/auth.js'; 

const router = express.Router();

// Public routes
router.get('/search', searchRecipes);
router.get('/random', getRandomRecipe);
router.get('/:id', getRecipeById);

// Protected routes
router.post('/ingredients-search', authenticate, searchByIngredients);
router.post('/generate', authenticate, generateAIRecipe);
router.post('/', authenticate, createRecipe);

export default router;
import Recipe from '../models/Recipe.js';
import recipeService from '../services/recipeService.js';

export const searchRecipes = async (req, res) => {
  try {
    const { query, dietary, cuisine, mealType, difficulty, maxReadyTime } = req.query;
    
    const filters = {
      dietary: dietary ? dietary.split(',') : [],
      cuisine: cuisine || '',
      mealType: mealType || '',
      difficulty: difficulty || '',
      maxReadyTime: maxReadyTime ? parseInt(maxReadyTime) : 120
    };

    const recipes = await recipeService.searchByQuery(query, filters);
    
    res.json({
      success: true,
      data: {
        results: recipes,
        total: recipes.length
      }
    });
  } catch (error) {
    console.error('Search recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search recipes'
    });
  }
};

export const searchByIngredients = async (req, res) => {
  try {
    const { ingredients, filters = {} } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ingredients are required'
      });
    }

    const recipes = await recipeService.searchByIngredients(ingredients, filters);
    
    res.json({
      success: true,
      data: recipes
    });
  } catch (error) {
    console.error('Search by ingredients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search recipes by ingredients'
    });
  }
};

export const generateAIRecipe = async (req, res) => {
  try {
    const { ingredients, preferences = {} } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ingredients are required'
      });
    }
    
    const aiRecipe = await recipeService.generateAIRecipe(ingredients, preferences);
    
    
    const recipe = new Recipe({
      ...aiRecipe,
      createdBy: req.user._id,
      source: 'ai'
    });
    
    await recipe.save();
    
    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('AI recipe generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recipe'
    });
  }
};

export const getRandomRecipe = async (req, res) => {
  try {
    const recipe = await recipeService.getRandomRecipe();
    
    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Get random recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get random recipe'
    });
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Get recipe by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recipe'
    });
  }
};

export const createRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      createdBy: req.user._id,
      source: 'user'
    };
    
    const recipe = new Recipe(recipeData);
    await recipe.save();
    
    res.status(201).json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create recipe'
    });
  }
};
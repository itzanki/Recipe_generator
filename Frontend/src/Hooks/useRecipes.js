import { useState, useCallback } from 'react';
import { recipesAPI } from '../utils/api';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const searchByQuery = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Searching recipes with query:', query, filters);
      const response = await recipesAPI.search(query, filters);
      
      let recipesData = [];
      if (response.data && response.data.results) {
        recipesData = response.data.results;
      } else if (Array.isArray(response.data)) {
        recipesData = response.data;
      } else if (Array.isArray(response)) {
        recipesData = response;
      }
      
      console.log('Search results:', recipesData.length, 'recipes found');
      setRecipes(recipesData);
      return recipesData;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch recipes. Please try again.';
      setError(errorMessage);
      console.error('Search error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByIngredients = useCallback(async (ingredients, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Searching by ingredients:', ingredients, filters);
      const response = await recipesAPI.searchByIngredients(ingredients, filters);
      
      let recipesData = [];
      if (response.data && Array.isArray(response.data)) {
        recipesData = response.data;
      } else if (Array.isArray(response)) {
        recipesData = response;
      }
      
      console.log('Ingredients search results:', recipesData.length, 'recipes found');
      setRecipes(recipesData);
      return recipesData;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch recipes by ingredients. Please try again.';
      setError(errorMessage);
      console.error('Ingredients search error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateAIRecipe = useCallback(async (ingredients, preferences = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Generating recipe with:', { ingredients, preferences });
      
      const response = await recipesAPI.generateAIRecipe(ingredients, preferences);
      
      console.log('Recipe generation response:', response);
      
      let generatedRecipe = null;
      if (response.data) {
        generatedRecipe = response.data;
      } else {
        generatedRecipe = response;
      }
      
      const formattedRecipe = {
        id: generatedRecipe._id || generatedRecipe.id || `recipe-${Date.now()}`,
        title: generatedRecipe.title || 'Generated Recipe',
        image: generatedRecipe.image || '/api/placeholder/400/300',
        readyInMinutes: generatedRecipe.readyInMinutes || 30,
        servings: generatedRecipe.servings || 2,
        summary: generatedRecipe.summary || 'A delicious recipe based on your ingredients and preferences.',
        extendedIngredients: generatedRecipe.extendedIngredients || generatedRecipe.ingredients || [],
        analyzedInstructions: generatedRecipe.analyzedInstructions || generatedRecipe.instructions || [],
        diets: generatedRecipe.diets || [],
        cuisines: generatedRecipe.cuisines || [],
        nutrition: generatedRecipe.nutrition || {},
        sourceUrl: generatedRecipe.sourceUrl || '',
        isAI: generatedRecipe.source === 'ai'
      };
      
      console.log('Formatted recipe:', formattedRecipe);
      setRecipes([formattedRecipe]);
      return formattedRecipe;
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate recipe. Please try again.';
      setError(errorMessage);
      console.error('Recipe generation error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRandom = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching random recipe...');
      const response = await recipesAPI.getRandom();
      
      console.log('Random recipe response:', response);
      
      let randomRecipe = null;
      if (response.data) {
        randomRecipe = response.data;
      } else {
        randomRecipe = response;
      }
      
      console.log('Random recipe:', randomRecipe);
      setRecipes([randomRecipe]);
      return randomRecipe;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get random recipe. Please try again.';
      setError(errorMessage);
      console.error('Random recipe error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRecipes = useCallback(() => {
    setRecipes([]);
    setSelectedRecipe(null);
    setError(null);
  }, []);

  return {
    recipes,
    loading,
    error,
    selectedRecipe,
    searchByQuery,
    searchByIngredients,
    generateAIRecipe,
    getRandom,
    clearRecipes,
    setError
  };
};

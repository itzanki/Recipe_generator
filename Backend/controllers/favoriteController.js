// import Favorite from '../models/Favorite.js';
// import Recipe from '../models/Recipe.js';

// export const getFavorites = async (req, res) => {
//   try {
//     const favorites = await Favorite.find({ user: req.user._id })
//       .populate('recipe')
//       .sort({ favoritedAt: -1 });
    
//     res.json({
//       success: true,
//       data: {
//         favorites: favorites.map(fav => fav.recipe),
//         count: favorites.length
//       }
//     });
//   } catch (error) {
//     console.error('Get favorites error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to get favorites'
//     });
//   }
// };

// export const addFavorite = async (req, res) => {
//   try {
//     const { recipeId } = req.params;
    
//     // Check if recipe exists
//     const recipe = await Recipe.findById(recipeId);
//     if (!recipe) {
//       return res.status(404).json({
//         success: false,
//         message: 'Recipe not found'
//       });
//     }
    
//     // Check if already favorited
//     const existingFavorite = await Favorite.findOne({
//       user: req.user._id,
//       recipe: recipeId
//     });
    
//     if (existingFavorite) {
//       return res.status(400).json({
//         success: false,
//         message: 'Recipe already in favorites'
//       });
//     }
    
//     // Add to favorites
//     const favorite = new Favorite({
//       user: req.user._id,
//       recipe: recipeId
//     });
    
//     await favorite.save();
    
//     // Populate the recipe data for response
//     await favorite.populate('recipe');
    
//     res.status(201).json({
//       success: true,
//       data: {
//         favorite: favorite.recipe
//       }
//     });
//   } catch (error) {
//     console.error('Add favorite error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to add favorite'
//     });
//   }
// };

// export const removeFavorite = async (req, res) => {
//   try {
//     const { recipeId } = req.params;
    
//     const favorite = await Favorite.findOneAndDelete({
//       user: req.user._id,
//       recipe: recipeId
//     });
    
//     if (!favorite) {
//       return res.status(404).json({
//         success: false,
//         message: 'Favorite not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Recipe removed from favorites'
//     });
//   } catch (error) {
//     console.error('Remove favorite error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to remove favorite'
//     });
//   }
// };

// export const isFavorite = async (req, res) => {
//   try {
//     const { recipeId } = req.params;
    
//     const favorite = await Favorite.findOne({
//       user: req.user._id,
//       recipe: recipeId
//     });
    
//     res.json({
//       success: true,
//       data: {
//         isFavorite: !!favorite
//       }
//     });
//   } catch (error) {
//     console.error('Check favorite error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to check favorite status'
//     });
//   }
// };
// controllers/favoriteController.js



import Favorite from '../models/Favorite.js';
import Recipe from '../models/Recipe.js';

export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .sort({ favoritedAt: -1 });
    
    res.json({
      success: true,
      data: {
        favorites: favorites.map(fav => fav.recipe),
        count: favorites.length
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get favorites'
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      recipeId: recipeId
    });
    
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Recipe already in favorites'
      });
    }
    
    // Determine if it's a TheMealDB recipe or local recipe
    let recipeData = req.body; // Send recipe data from frontend
    let source = 'local';
    
    // If recipeId is numeric, it's from TheMealDB
    if (/^\d+$/.test(recipeId)) {
      source = 'themealdb';
      
      // If no recipe data provided, try to fetch from TheMealDB
      if (!recipeData || Object.keys(recipeData).length === 0) {
        try {
          const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
          const data = await response.json();
          if (data.meals && data.meals[0]) {
            recipeData = formatMealDBRecipe(data.meals[0]);
          }
        } catch (error) {
          console.error('Failed to fetch recipe from TheMealDB:', error);
        }
      }
    } else {
      // It's a local recipe, check if exists
      try {
        const localRecipe = await Recipe.findById(recipeId);
        if (!localRecipe) {
          return res.status(404).json({
            success: false,
            message: 'Recipe not found'
          });
        }
        recipeData = localRecipe.toObject();
      } catch (error) {
        console.error('Error finding local recipe:', error);
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }
    }
    
    // Add to favorites
    const favorite = new Favorite({
      user: req.user._id,
      recipe: recipeData,
      recipeId: recipeId,
      source: source
    });
    
    await favorite.save();
    
    res.status(201).json({
      success: true,
      data: {
        favorite: favorite.recipe
      }
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite'
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      recipeId: recipeId
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Recipe removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove favorite'
    });
  }
};

export const isFavorite = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const favorite = await Favorite.findOne({
      user: req.user._id,
      recipeId: recipeId
    });
    
    res.json({
      success: true,
      data: {
        isFavorite: !!favorite
      }
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check favorite status'
    });
  }
};

// Helper function to format TheMealDB recipe
const formatMealDBRecipe = (meal) => {
  const ingredients = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        original: `${measure || ''} ${ingredient}`.trim(),
        amount: measure || '',
        unit: '',
        name: ingredient
      });
    }
  }
  
  const instructions = meal.strInstructions ? meal.strInstructions.split('\r\n').filter(step => step.trim()) : [];
  const analyzedInstructions = instructions.length > 0 ? [{
    steps: instructions.map((step, index) => ({
      number: index + 1,
      step: step.trim()
    }))
  }] : [];
  
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    readyInMinutes: 45,
    servings: 4,
    summary: meal.strInstructions ? meal.strInstructions.substring(0, 200) + '...' : 'Delicious meal from TheMealDB',
    extendedIngredients: ingredients,
    analyzedInstructions: analyzedInstructions,
    diets: [],
    cuisines: [meal.strArea || 'International'],
    dishTypes: [meal.strCategory || 'Main Course'],
    source: 'themealdb',
    isPublic: true,
    sourceUrl: meal.strSource || meal.strYoutube || '',
    rating: {
      average: 4.5,
      count: Math.floor(Math.random() * 100) + 1
    }
  };
};
import axios from 'axios';
import Recipe from '../models/Recipe.js';

class RecipeService {
  constructor() {
    this.baseURL = 'https://www.themealdb.com/api/json/v1/1';
  }

  async searchByQuery(query, filters = {}) {
    try {
      console.log('Searching TheMealDB for:', query);
      
  
      let recipes = await this.searchTheMealDBByName(query);
      
      
      if (!recipes || recipes.length === 0) {
        recipes = await this.searchTheMealDBByIngredient(query);
      }
      
      
      recipes = this.applyFilters(recipes, filters);
      
      if (recipes && recipes.length > 0) {
        console.log(`Found ${recipes.length} recipes from TheMealDB`);
        return recipes;
      }
      
    
      console.log('No results from TheMealDB, using mock data');
      return this.filterMockRecipes(query, filters);
      
    } catch (error) {
      console.log('TheMealDB search failed, using mock data:', error.message);
      return this.filterMockRecipes(query, filters);
    }
  }

  async searchByIngredients(ingredients, filters = {}) {
    try {
      console.log('Searching TheMealDB by ingredients:', ingredients);
      
      let allRecipes = [];
      
      
      for (const ingredient of ingredients.slice(0, 3)) { 
        const recipes = await this.searchTheMealDBByIngredient(ingredient);
        if (recipes) {
          allRecipes = [...allRecipes, ...recipes];
        }
      }
      
      
      allRecipes = this.removeDuplicates(allRecipes);
      
    
      allRecipes = this.filterByIngredientMatch(allRecipes, ingredients);
      
      
      allRecipes = this.applyFilters(allRecipes, filters);
      
      if (allRecipes.length > 0) {
        console.log(`Found ${allRecipes.length} recipes matching ingredients`);
        return allRecipes;
      }
      
      // Fallback to mock data
      return this.filterMockRecipes(ingredients.join(' '), filters);
      
    } catch (error) {
      console.log('Ingredient search failed:', error.message);
      return this.filterMockRecipes(ingredients.join(' '), filters);
    }
  }

  async searchTheMealDBByName(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search.php?s=${encodeURIComponent(query)}`);
      
      if (response.data.meals) {
        return response.data.meals.map(meal => this.formatTheMealDBRecipe(meal));
      }
      return [];
    } catch (error) {
      console.error('Error searching by name:', error.message);
      return [];
    }
  }

  async searchTheMealDBByIngredient(ingredient) {
    try {
      const response = await axios.get(`${this.baseURL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      
      if (response.data.meals) {
        // Get full details for each meal
        const mealDetails = await Promise.all(
          response.data.meals.slice(0, 10).map(meal => 
            this.getMealDetails(meal.idMeal)
          )
        );
        
        return mealDetails.filter(meal => meal !== null);
      }
      return [];
    } catch (error) {
      console.error('Error searching by ingredient:', error.message);
      return [];
    }
  }

  async getMealDetails(mealId) {
    try {
      const response = await axios.get(`${this.baseURL}/lookup.php?i=${mealId}`);
      
      if (response.data.meals && response.data.meals[0]) {
        return this.formatTheMealDBRecipe(response.data.meals[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting meal details:', error.message);
      return null;
    }
  }

  formatTheMealDBRecipe(meal) {
    // Extract ingredients and measurements
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          original: `${measure || ''} ${ingredient}`.trim(),
          amount: this.parseAmount(measure),
          unit: this.parseUnit(measure),
          name: ingredient
        });
      }
    }

    // Parse instructions
    const instructions = meal.strInstructions ? 
      meal.strInstructions.split('\r\n').filter(step => step.trim()) : 
      ['Mix all ingredients together and cook until done.'];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      readyInMinutes: 45, 
      servings: 4, 
      summary: meal.strInstructions ? 
        meal.strInstructions.substring(0, 200) + '...' : 
        `A delicious ${meal.strCategory || 'recipe'} from ${meal.strArea || 'International'} cuisine.`,
      extendedIngredients: ingredients,
      analyzedInstructions: [{
        steps: instructions.map((step, index) => ({
          number: index + 1,
          step: step.trim()
        }))
      }],
      diets: this.getDietsFromMeal(meal),
      cuisines: meal.strArea ? [meal.strArea] : ['International'],
      dishTypes: meal.strCategory ? [meal.strCategory] : ['Main Course'],
      nutrition: {
        calories: 350, 
        protein: "15g",
        carbohydrates: "45g",
        fat: "12g"
      },
      sourceUrl: meal.strSource || '',
      sourceApi: 'themealdb',
      tags: meal.strTags ? meal.strTags.split(',') : [],
      videoUrl: meal.strYoutube || ''
    };
  }

  parseAmount(measure) {
    if (!measure) return 1;
    
    
    const match = measure.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 1;
  }

  parseUnit(measure) {
    if (!measure) return '';
    
    // Extract unit from measurement
    const units = ['cup', 'tsp', 'tbsp', 'oz', 'lb', 'kg', 'g', 'ml', 'l', 'piece', 'slice', 'clove'];
    for (const unit of units) {
      if (measure.toLowerCase().includes(unit)) {
        return unit;
      }
    }
    
    return '';
  }

  getDietsFromMeal(meal) {
    const diets = [];
    
    // Simple diet detection based on ingredients and category
    if (meal.strCategory && meal.strCategory.toLowerCase().includes('vegetarian')) {
      diets.push('vegetarian');
    }
    
    // You can add more diet detection logic here
    return diets.length > 0 ? diets : ['balanced'];
  }

  removeDuplicates(recipes) {
    const seen = new Set();
    return recipes.filter(recipe => {
      if (seen.has(recipe.id)) {
        return false;
      }
      seen.add(recipe.id);
      return true;
    });
  }

  filterByIngredientMatch(recipes, searchIngredients) {
    return recipes.filter(recipe => {
      const recipeIngredients = recipe.extendedIngredients.map(ing => 
        ing.name.toLowerCase()
      );
      
      // Count how many search ingredients are in the recipe
      const matchCount = searchIngredients.filter(searchIng =>
        recipeIngredients.some(recipeIng =>
          recipeIng.includes(searchIng.toLowerCase())
        )
      ).length;
      
      // Return recipes that contain at least half of the search ingredients
      return matchCount >= Math.ceil(searchIngredients.length / 2);
    });
  }

  applyFilters(recipes, filters) {
    let filtered = [...recipes];
    
    // Filter by dietary preferences
    if (filters.dietary && filters.dietary.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.dietary.some(diet => recipe.diets.includes(diet))
      );
    }

    // Filter by cuisine
    if (filters.cuisine) {
      filtered = filtered.filter(recipe =>
        recipe.cuisines.some(c => c.toLowerCase() === filters.cuisine.toLowerCase())
      );
    }

    // Filter by cooking time
    if (filters.maxReadyTime) {
      filtered = filtered.filter(recipe =>
        recipe.readyInMinutes <= filters.maxReadyTime
      );
    }

    return filtered;
  }

  async generateAIRecipe(ingredients, preferences = {}) {
    // First try to find real recipes with these ingredients
    try {
      const realRecipes = await this.searchByIngredients(ingredients, preferences);
      if (realRecipes.length > 0) {
        // Return the first matching real recipe
        return realRecipes[0];
      }
    } catch (error) {
      console.log('Could not find real recipes, generating mock AI recipe');
    }
    
    // Fallback to mock AI generation
    const mainIngredient = ingredients[0] || 'vegetables';
    
    return {
      title: `Special ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Recipe`,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
      readyInMinutes: 30,
      servings: 2,
      summary: `A custom recipe using ${ingredients.join(', ')}. Created based on your preferences and available ingredients.`,
      extendedIngredients: ingredients.map((ing, index) => ({
        original: `${index + 1} cup ${ing}`,
        amount: index + 1,
        unit: 'cup',
        name: ing
      })),
      analyzedInstructions: [{
        steps: [
          { number: 1, step: "Prepare and chop all your ingredients." },
          { number: 2, step: "Heat oil in a pan and sauté the main ingredients." },
          { number: 3, step: "Add seasonings and cook for 15-20 minutes." },
          { number: 4, step: "Adjust seasoning to taste and serve hot." }
        ]
      }],
      diets: preferences.dietary || ['balanced'],
      cuisines: preferences.cuisine ? [preferences.cuisine] : ['International'],
      nutrition: {
        calories: 350,
        protein: "15g",
        carbohydrates: "45g",
        fat: "12g"
      },
      source: 'ai'
    };
  }

  async getRandomRecipe() {
    try {
      const response = await axios.get(`${this.baseURL}/random.php`);
      
      if (response.data.meals && response.data.meals[0]) {
        return this.formatTheMealDBRecipe(response.data.meals[0]);
      }
    } catch (error) {
      console.log('Random recipe API failed, using mock data');
    }
    
    // Fallback to mock data
    return this.getRandomMockRecipe();
  }

  // Mock data fallback
  mockRecipes = [
    {
      id: '1',
      title: "Vegetable Stir Fry",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
      readyInMinutes: 20,
      servings: 2,
      summary: "A quick and healthy vegetable stir fry packed with fresh flavors and colorful veggies.",
      extendedIngredients: [
        { original: "2 cups mixed vegetables (bell peppers, broccoli, carrots)", amount: 2, unit: "cups", name: "mixed vegetables" },
        { original: "2 cloves garlic, minced", amount: 2, unit: "cloves", name: "garlic" },
        { original: "1 tbsp soy sauce", amount: 1, unit: "tbsp", name: "soy sauce" },
        { original: "1 tsp ginger, grated", amount: 1, unit: "tsp", name: "ginger" },
        { original: "2 tbsp vegetable oil", amount: 2, unit: "tbsp", name: "vegetable oil" }
      ],
      analyzedInstructions: [{
        steps: [
          { number: 1, step: "Heat oil in a large wok or skillet over high heat." },
          { number: 2, step: "Add garlic and ginger, stir for 30 seconds until fragrant." },
          { number: 3, step: "Add vegetables and stir fry for 5-7 minutes until crisp-tender." },
          { number: 4, step: "Add soy sauce and toss to combine. Serve immediately." }
        ]
      }],
      diets: ["vegetarian", "vegan"],
      cuisines: ["Asian"],
      nutrition: {
        calories: 180,
        protein: "5g",
        carbohydrates: "20g",
        fat: "8g"
      }
    },
    {
      id: '2',
      title: "Creamy Garlic Pasta",
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop",
      readyInMinutes: 25,
      servings: 3,
      summary: "Rich and creamy pasta with garlic and parmesan cheese.",
      extendedIngredients: [
        { original: "8 oz pasta", amount: 8, unit: "oz", name: "pasta" },
        { original: "4 cloves garlic, minced", amount: 4, unit: "cloves", name: "garlic" },
        { original: "1 cup heavy cream", amount: 1, unit: "cup", name: "heavy cream" },
        { original: "1/2 cup grated parmesan", amount: 0.5, unit: "cup", name: "parmesan" },
        { original: "2 tbsp butter", amount: 2, unit: "tbsp", name: "butter" }
      ],
      analyzedInstructions: [{
        steps: [
          { number: 1, step: "Cook pasta according to package directions." },
          { number: 2, step: "Melt butter in a pan, add garlic and cook until fragrant." },
          { number: 3, step: "Add cream and bring to a simmer." },
          { number: 4, step: "Stir in parmesan until melted and creamy." },
          { number: 5, step: "Toss with cooked pasta and serve." }
        ]
      }],
      diets: ["vegetarian"],
      cuisines: ["Italian"],
      nutrition: {
        calories: 450,
        protein: "15g",
        carbohydrates: "45g",
        fat: "22g"
      }
    }
  ];

  filterMockRecipes(query, filters) {
    let filtered = [...this.mockRecipes];
    
    if (query) {
      const queryLower = query.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.title.toLowerCase().includes(queryLower) ||
        recipe.summary.toLowerCase().includes(queryLower) ||
        recipe.diets.some(diet => diet.toLowerCase().includes(queryLower)) ||
        recipe.cuisines.some(cuisine => cuisine.toLowerCase().includes(queryLower))
      );
    }

    return this.applyFilters(filtered, filters);
  }

  getRandomMockRecipe() {
    const randomIndex = Math.floor(Math.random() * this.mockRecipes.length);
    return this.mockRecipes[randomIndex];
  }
}

export default new RecipeService();
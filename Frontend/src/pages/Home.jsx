import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../Hooks/useAuth';
import { useRecipes } from '../Hooks/useRecipes';
import HeroSection from '../components/HeroSection';
import FilterSection from '../components/FilterSection';
import IngredientInput from '../components/IngredientInput';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { user } = useAuth();
  const { 
    recipes, 
    loading, 
    error, 
    searchByQuery, 
    searchByIngredients, 
    generateAIRecipe,
    getRandom, 
    clearRecipes 
  } = useRecipes();
  
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [filters, setFilters] = useState({
    dietary: [],
    cuisine: '',
    mealType: '',
    difficulty: '',
    maxReadyTime: 120
  });
  const [searchMode, setSearchMode] = useState('query'); // 'query' or 'ai'

  // Clear recipes when component unmounts
  useEffect(() => {
    return () => clearRecipes();
  }, [clearRecipes]);

  const handleSearch = (query) => {
    setSearchMode('query');
    searchByQuery(query, filters);
  };

  const handleSearchByIngredients = async (ingredientsList) => {
    setSearchMode('query');
    await searchByIngredients(ingredientsList, filters);
  };

  const handleGenerateAIRecipe = async (ingredientsList) => {
    setSearchMode('ai');
    try {
      await generateAIRecipe(ingredientsList, {
        dietary: filters.dietary,
        cuisine: filters.cuisine,
        mealType: filters.mealType,
        maxCookingTime: filters.maxReadyTime
      });
    } catch (error) {
      console.error('Recipe generation failed:', error);
    }
  };

  const handleRandomRecipe = () => {
    setSearchMode('query');
    getRandom();
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const featuredCategories = [
    { name: 'Quick & Easy', icon: '⚡', count: '15-30 min', color: 'yellow' },
    { name: 'Healthy', icon: '🥗', count: 'Low Calorie', color: 'green' },
    { name: 'Vegetarian', icon: '🌱', count: 'Plant-based', color: 'emerald' },
    { name: 'Comfort Food', icon: '🍲', count: 'Hearty Meals', color: 'orange' },
    { name: 'Desserts', icon: '🍰', count: 'Sweet Treats', color: 'pink' },
    { name: 'International', icon: '🌍', count: 'Global Cuisine', color: 'purple' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100"
    >
      {/* Welcome Message for Logged-in Users */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm border-b border-orange-200"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-gray-600">
                  Ready to discover some amazing recipes today?
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Today's Special</p>
                <p className="font-semibold text-orange-600">Amz Generated Recipes</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <HeroSection 
        onSearch={handleSearch}
        onRandom={handleRandomRecipe}
        loading={loading}
      />

      <div className="container mx-auto px-4 py-8">
        {/* AI Generation Notice */}
        {searchMode === 'ai' && recipes.length > 0 && (
            <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-8 shadow-lg"
           >
             <div className="flex items-center space-x-3">
             <div className="text-2xl">🍳</div> {/* Changed from 🤖 */}
           <div>
            <h3 className="font-bold text-lg">Generated Recipe</h3> {/* Changed from AI-Generated */}
            <p className="text-purple-100 text-sm">
              This recipe was generated based on your ingredients and preferences
            </p> {/* Updated text */}
           </div>
          </div>
        </motion.div>
          )}

        {/* Featured Categories */}
        {!loading && recipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Explore by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredCategories.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(category.name)}
                  className={`p-4 rounded-2xl bg-white shadow-lg border-2 border-transparent hover:border-${category.color}-500 transition-all duration-300 text-center group`}
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <div className="font-semibold text-gray-800 text-sm mb-1">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.count}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Ingredient Input with AI Option */}
        <IngredientInput
  ingredients={ingredients}
  onIngredientsChange={setIngredients}
  onSearchByIngredients={handleSearchByIngredients}
  onGenerateAIRecipe={handleGenerateAIRecipe}
  loading={loading}
/>
        {/* Filter Section */}
        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* Loading State */}
        {loading && <LoadingSpinner type="recipes" />}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-8"
          >
            <div className="text-6xl mb-4">😞</div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRandomRecipe}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
              >
                Try Surprise Me Instead
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && !ingredients.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">🍳</div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              Ready to Cook Something Amazing?
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Search for recipes by name, browse categories, add ingredients you have on hand, 
              or let our AI create a custom recipe just for you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRandomRecipe}
                className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl"
              >
                🎲 Surprise Me!
              </button>
            </div>
          </motion.div>
        )}

        {/* No Results State */}
        {!loading && !error && recipes.length === 0 && ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No recipes found with these ingredients
            </h3>
            <p className="text-gray-600 mb-6">
              Try adding more ingredients, being less specific, or let AI generate a custom recipe!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleGenerateAIRecipe(ingredients)}
                className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
              >
                🤖 Generate AI Recipe
              </button>
              <button
                onClick={handleRandomRecipe}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                🎲 Surprise Me!
              </button>
            </div>
          </motion.div>
        )}

        {/* Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {searchMode === 'ai' ? 'AI-Generated Recipe' : 'Delicious Recipes for You'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {searchMode === 'ai' 
                    ? 'Custom recipe created just for you'
                    : `Found ${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} matching your search`
                  }
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearRecipes}
                className="text-gray-500 hover:text-gray-700 font-medium flex items-center space-x-2"
              >
                <span>Clear Results</span>
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id || recipe._id}
                  recipe={recipe}
                  index={index}
                  onViewRecipe={handleViewRecipe}
                />
              ))}
            </motion.div>

            {/* Load More Button */}
            {recipes.length >= 4 && searchMode !== 'ai' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRandomRecipe}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Load More Recipes
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default Home;
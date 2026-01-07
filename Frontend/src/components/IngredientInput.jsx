import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Plus, 
  ShoppingCart, 
  Search, 
  Sparkles, 
  RotateCcw,
  Wand2,
  ChefHat
} from 'lucide-react';

const IngredientInput = ({ 
  ingredients, 
  onIngredientsChange, 
  onSearchByIngredients,
  onGenerateAIRecipe,
  loading = false 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search'

  const pantryStaples = [
    'salt', 'pepper', 'olive oil', 'garlic', 'onion', 'flour', 'sugar',
    'butter', 'eggs', 'milk', 'rice', 'pasta', 'soy sauce', 'vinegar',
    'baking powder', 'honey', 'lemon', 'parmesan cheese', 'bread crumbs'
  ];

  const popularIngredients = [
    'chicken breast', 'ground beef', 'salmon', 'shrimp',
    'broccoli', 'spinach', 'carrots', 'bell peppers', 'tomatoes',
    'potatoes', 'mushrooms', 'avocado', 'cheese', 'yogurt'
  ];

  const addIngredient = (ingredient) => {
    const trimmedIngredient = ingredient.trim().toLowerCase();
    if (trimmedIngredient && !ingredients.includes(trimmedIngredient)) {
      onIngredientsChange([...ingredients, trimmedIngredient]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeIngredient = (indexToRemove) => {
    onIngredientsChange(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient(inputValue);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (ingredients.length > 0) {
      onSearchByIngredients(ingredients);
    }
  };

  const handleAIGenerate = (e) => {
    e.preventDefault();
    if (ingredients.length > 0) {
      onGenerateAIRecipe(ingredients);
    }
  };

  const clearAllIngredients = () => {
    onIngredientsChange([]);
  };

  const filteredPantryStaples = pantryStaples.filter(staple =>
    staple.toLowerCase().includes(inputValue.toLowerCase()) &&
    !ingredients.includes(staple)
  );

  const filteredPopularIngredients = popularIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(inputValue.toLowerCase()) &&
    !ingredients.includes(ingredient)
  );

  const quickRecipeIdeas = [
    {
      name: "Quick Stir Fry",
      ingredients: ["chicken", "broccoli", "soy sauce", "garlic"],
      emoji: "🍳"
    },
    {
      name: "Pasta Dish",
      ingredients: ["pasta", "tomatoes", "garlic", "basil"],
      emoji: "🍝"
    },
    {
      name: "Salad Bowl",
      ingredients: ["lettuce", "tomatoes", "cucumber", "olive oil"],
      emoji: "🥗"
    },
    {
      name: "Smoothie",
      ingredients: ["banana", "berries", "yogurt", "honey"],
      emoji: "🥤"
    }
  ];

  const applyQuickRecipe = (recipe) => {
    onIngredientsChange([...ingredients, ...recipe.ingredients]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
            <ShoppingCart className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">What's in your kitchen?</h3>
            <p className="text-gray-600 text-sm">Add ingredients to search recipes or generate</p>
          </div>
        </div>

        {ingredients.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAllIngredients}
            className="text-red-500 hover:text-red-600 font-medium flex items-center space-x-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            activeTab === 'search'
              ? 'bg-white text-orange-600 shadow-lg'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search Recipes</span>
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            activeTab === 'ai'
              ? 'bg-white text-purple-600 shadow-lg'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Generate</span>
        </button>
      </div>

      {/* Input Area */}
      <form onSubmit={activeTab === 'search' ? handleSearchSubmit : handleAIGenerate} className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyPress={handleKeyPress}
            placeholder={
              activeTab === 'search' 
                ? "Add ingredients (e.g., chicken, broccoli, rice) or press Enter..."
                : "Add ingredients for AI to generate a custom recipe..."
            }
            className="w-full pl-12 pr-24 py-4 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all duration-300 text-lg bg-gray-50/50"
            disabled={loading}
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addIngredient(inputValue)}
              disabled={!inputValue.trim() || loading}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 transition-all duration-300 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </motion.button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && inputValue && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 max-h-80 overflow-y-auto"
            >
              {/* Matching Pantry Staples */}
              {filteredPantryStaples.length > 0 && (
                <div className="p-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center space-x-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Pantry Staples</span>
                  </div>
                  <div className="space-y-1">
                    {filteredPantryStaples.slice(0, 5).map((staple) => (
                      <button
                        key={staple}
                        type="button"
                        onClick={() => addIngredient(staple)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-3 h-3 text-orange-500" />
                        <span>{staple}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Popular Ingredients */}
              {filteredPopularIngredients.length > 0 && (
                <div className="p-3 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Popular Ingredients
                  </div>
                  <div className="space-y-1">
                    {filteredPopularIngredients.slice(0, 5).map((ingredient) => (
                      <button
                        key={ingredient}
                        type="button"
                        onClick={() => addIngredient(ingredient)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 text-gray-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-3 h-3 text-orange-500" />
                        <span>{ingredient}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Ingredient Chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        <AnimatePresence>
          {ingredients.map((ingredient, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className={`px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg group ${
                activeTab === 'ai' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
              }`}
            >
              <span className="font-medium text-sm">{ingredient}</span>
              <button
                onClick={() => removeIngredient(index)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                disabled={loading}
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {ingredients.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-8 w-full"
          >
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No ingredients added yet</p>
            <p className="text-sm">Start typing to add ingredients from your kitchen</p>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      {ingredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {activeTab === 'search' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              onClick={handleSearchSubmit}
              disabled={loading || ingredients.length === 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>Find Recipes with {ingredients.length} Ingredients</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎯
              </motion.span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              onClick={handleAIGenerate}
              disabled={loading || ingredients.length === 0}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              <span>Generate Recipe with {ingredients.length} Ingredients</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                👨‍🍳
              </motion.span>
            </motion.button>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-lg font-bold text-gray-800">{ingredients.length}</div>
              <div className="text-xs text-gray-600">Ingredients</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-lg font-bold text-gray-800">
                {activeTab === 'search' ? '50+' : 'Custom'}
              </div>
              <div className="text-xs text-gray-600">
                {activeTab === 'search' ? 'Recipes' : 'Recipe'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-lg font-bold text-gray-800">
                {ingredients.length * 2}+
              </div>
              <div className="text-xs text-gray-600">Matches</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Recipe Ideas */}
      {ingredients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center space-x-2">
            <ChefHat className="w-4 h-4 text-orange-500" />
            <span>Quick Recipe Ideas</span>
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {quickRecipeIdeas.map((recipe, index) => (
              <motion.button
                key={recipe.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => applyQuickRecipe(recipe)}
                className="p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:border-orange-300 transition-all duration-300 text-left group"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{recipe.emoji}</span>
                  <span className="font-semibold text-gray-800 text-sm">{recipe.name}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipe.ingredients.slice(0, 3).map((ing, idx) => (
                    <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {ing}
                    </span>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <span className="text-xs text-gray-500">+{recipe.ingredients.length - 3}</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Add Sections */}
      <div className="grid md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-100">
        {/* Pantry Staples */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>Common Pantry Staples</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {pantryStaples.slice(0, 8).map((staple) => (
              <motion.button
                key={staple}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addIngredient(staple)}
                disabled={ingredients.includes(staple) || loading}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {staple}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Popular Ingredients */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Popular Ingredients</h4>
          <div className="flex flex-wrap gap-2">
            {popularIngredients.slice(0, 8).map((ingredient) => (
              <motion.button
                key={ingredient}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addIngredient(ingredient)}
                disabled={ingredients.includes(ingredient) || loading}
                className="text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {ingredient}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
      >
        <div className="flex items-start space-x-3">
          <div className="text-purple-500 text-lg">💡</div>
          <div>
            <p className="font-semibold text-purple-800 text-sm">
              {activeTab === 'search' ? 'Search Tips' : 'AI Generation Tips'}
            </p>
            <p className="text-purple-700 text-sm">
              {activeTab === 'search' 
                ? 'Add 3-5 main ingredients for best results. The system will find recipes that use most of your ingredients!'
                : 'AI works best with 2-6 ingredients. Be specific for more accurate recipe generation!'
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mode-specific Benefits */}
      <AnimatePresence>
        {ingredients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 rounded-2xl border"
          >
            {activeTab === 'search' ? (
              <div className="flex items-center space-x-3">
                <div className="text-green-500 text-lg">🔍</div>
                <div>
                  <p className="font-semibold text-green-800 text-sm">Recipe Search</p>
                  <p className="text-green-700 text-sm">
                    Finding existing recipes that match your {ingredients.length} ingredients from our database.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="text-purple-500 text-lg">✨</div>
                <div>
                  <p className="font-semibold text-purple-800 text-sm">Generation</p>
                  <p className="text-purple-700 text-sm">
                    Creating a custom recipe specifically for your {ingredients.length} ingredients.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IngredientInput;
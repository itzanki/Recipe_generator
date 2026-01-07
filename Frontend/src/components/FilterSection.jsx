import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, Sliders, X, Sparkles } from 'lucide-react';

const FilterSection = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('dietary');

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥦', color: 'green' },
    { id: 'vegan', label: 'Vegan', icon: '🌱', color: 'emerald' },
    { id: 'glutenFree', label: 'Gluten Free', icon: '🌾', color: 'amber' },
    { id: 'dairyFree', label: 'Dairy Free', icon: '🥛', color: 'blue' },
    { id: 'keto', label: 'Keto Friendly', icon: '🥑', color: 'purple' },
    { id: 'lowCarb', label: 'Low Carb', icon: '🍗', color: 'red' }
  ];

  const cuisineOptions = [
    { value: 'italian', label: 'Italian', flag: '🇮🇹' },
    { value: 'mexican', label: 'Mexican', flag: '🇲🇽' },
    { value: 'asian', label: 'Asian', flag: '🍜' },
    { value: 'american', label: 'American', flag: '🇺🇸' },
    { value: 'mediterranean', label: 'Mediterranean', flag: '🧆' },
    { value: 'indian', label: 'Indian', flag: '🇮🇳' },
    { value: 'chinese', label: 'Chinese', flag: '🥡' },
    { value: 'thai', label: 'Thai', flag: '🇹🇭' },
    { value: 'french', label: 'French', flag: '🇫🇷' },
    { value: 'japanese', label: 'Japanese', flag: '🇯🇵' }
  ];

  const mealTypeOptions = [
    { value: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { value: 'lunch', label: 'Lunch', icon: '🥪' },
    { value: 'dinner', label: 'Dinner', icon: '🍽️' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
    { value: 'dessert', label: 'Dessert', icon: '🍰' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'hard', label: 'Advanced', color: 'red' }
  ];

  const colorClasses = {
    green: 'bg-green-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const handleDietaryToggle = (optionId) => {
    const updated = filters.dietary.includes(optionId)
      ? filters.dietary.filter(item => item !== optionId)
      : [...filters.dietary, optionId];
    
    onFiltersChange({ ...filters, dietary: updated });
  };

  const handleCuisineChange = (cuisine) => {
    onFiltersChange({ ...filters, cuisine: cuisine === filters.cuisine ? '' : cuisine });
  };

  const handleMealTypeChange = (mealType) => {
    onFiltersChange({ ...filters, mealType: mealType === filters.mealType ? '' : mealType });
  };

  const handleDifficultyChange = (difficulty) => {
    onFiltersChange({ ...filters, difficulty: difficulty === filters.difficulty ? '' : difficulty });
  };

  const handleMaxTimeChange = (time) => {
    onFiltersChange({ ...filters, maxReadyTime: time });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dietary: [],
      cuisine: '',
      mealType: '',
      difficulty: '',
      maxReadyTime: 120
    });
  };

  const getActiveFiltersCount = () => {
    let count = filters.dietary.length;
    if (filters.cuisine) count++;
    if (filters.mealType) count++;
    if (filters.difficulty) count++;
    if (filters.maxReadyTime < 120) count++;
    return count;
  };

  const categories = [
    { id: 'dietary', label: 'Dietary', icon: '🥗' },
    { id: 'cuisine', label: 'Cuisine', icon: '🌍' },
    { id: 'mealType', label: 'Meal Type', icon: '🍽️' },
    { id: 'difficulty', label: 'Difficulty', icon: '📊' },
    { id: 'time', label: 'Time', icon: '⏱️' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Sliders className="w-6 h-6 text-orange-500" />
            {getActiveFiltersCount() > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
              >
                {getActiveFiltersCount()}
              </motion.span>
            )}
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800">Filters & Preferences</h3>
            <p className="text-gray-600 text-sm">
              {getActiveFiltersCount() > 0 
                ? `${getActiveFiltersCount()} active filters` 
                : 'Customize your recipe search'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {getActiveFiltersCount() > 0 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                clearAllFilters();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </motion.button>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100"
          >
            {/* Category Tabs */}
            <div className="flex overflow-x-auto px-6 pt-4 border-b border-gray-100 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-t-lg font-medium whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'text-orange-600 bg-orange-50 border-b-2 border-orange-500'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {/* Dietary Preferences */}
              {activeCategory === 'dietary' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold text-gray-800 text-lg flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span>Dietary Preferences</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {dietaryOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDietaryToggle(option.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-3 ${
                          filters.dietary.includes(option.id)
                            ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm">{option.label}</div>
                          {filters.dietary.includes(option.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`w-3 h-3 rounded-full ${colorClasses[option.color]} mt-1`}
                            />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Cuisine Type */}
              {activeCategory === 'cuisine' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold text-gray-800 text-lg">Cuisine Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {cuisineOptions.map((cuisine) => (
                      <motion.button
                        key={cuisine.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCuisineChange(cuisine.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          filters.cuisine === cuisine.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{cuisine.flag}</div>
                        <div className="font-semibold text-sm">{cuisine.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Meal Type */}
              {activeCategory === 'mealType' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold text-gray-800 text-lg">Meal Type</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mealTypeOptions.map((mealType) => (
                      <motion.button
                        key={mealType.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMealTypeChange(mealType.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          filters.mealType === mealType.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{mealType.icon}</div>
                        <div className="font-semibold text-sm">{mealType.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Difficulty */}
              {activeCategory === 'difficulty' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <h4 className="font-semibold text-gray-800 text-lg">Difficulty Level</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {difficultyOptions.map((difficulty) => (
                      <motion.button
                        key={difficulty.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDifficultyChange(difficulty.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          filters.difficulty === difficulty.value
                            ? `border-${difficulty.color}-500 bg-${difficulty.color}-50 text-${difficulty.color}-700 shadow-lg`
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${colorClasses[difficulty.color]} mx-auto mb-2`}></div>
                        <div className="font-semibold text-sm">{difficulty.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Cooking Time */}
              {activeCategory === 'time' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg mb-4">
                      Max Cooking Time: {filters.maxReadyTime} minutes
                    </h4>
                    <div className="relative">
                      <input
                        type="range"
                        min="10"
                        max="120"
                        step="10"
                        value={filters.maxReadyTime}
                        onChange={(e) => handleMaxTimeChange(parseInt(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-3">
                        <span>10 min</span>
                        <span>30 min</span>
                        <span>60 min</span>
                        <span>90 min</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Time Presets */}
                  <div className="grid grid-cols-4 gap-3">
                    {[15, 30, 45, 60].map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMaxTimeChange(time)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                          filters.maxReadyTime === time
                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-sm">{time} min</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Apply Filters Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 border-t border-gray-100 bg-gray-50"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Apply Filters
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterSection;

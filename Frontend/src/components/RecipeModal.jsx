import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Clock, Users, Play, Heart, Share2, Bookmark, 
  ChefHat, Star, TrendingUp, Zap, Scale
} from 'lucide-react';
import { useFavorites } from  "../Hooks/useFavorites";

const RecipeModal = ({ recipe, isOpen, onClose }) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(recipe?.servings || 1);
  const favorite = isFavorite(recipe?.id);

  if (!isOpen || !recipe) return null;

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const getYoutubeUrl = (title) => {
    const query = encodeURIComponent(`${title} recipe`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  const adjustIngredient = (ingredient, factor) => {
    // Simple ingredient amount adjustment
    return ingredient.original.replace(/(\d+)(?:\/(\d+))?/g, (match, whole, fraction) => {
      if (fraction) {
        const amount = (parseInt(whole) + parseInt(fraction) / parseInt(fraction)) * factor;
        return Math.round(amount * 100) / 100;
      }
      const amount = parseInt(whole) * factor;
      return Math.round(amount);
    });
  };

  const nutritionFacts = recipe.nutrition?.nutrients || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-20 z-50 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative h-80 md:h-96">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-6 right-6 bg-white/90 p-3 rounded-xl shadow-lg backdrop-blur-sm hover:bg-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Action Buttons */}
              <div className="absolute top-6 left-6 flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavoriteClick}
                  className="bg-white/90 p-3 rounded-xl shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 transition-colors ${
                      favorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`} 
                  />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/90 p-3 rounded-xl shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <Bookmark className="w-5 h-5 text-gray-600" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/90 p-3 rounded-xl shadow-lg backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Recipe Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                >
                  {recipe.title}
                </motion.h2>
                
                <div className="flex items-center space-x-6 text-white/90">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">{recipe.readyInMinutes} minutes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{servings} servings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChefHat className="w-5 h-5" />
                    <span className="font-semibold">
                      {recipe.readyInMinutes <= 20 ? 'Easy' : 
                       recipe.readyInMinutes <= 40 ? 'Medium' : 'Advanced'}
                    </span>
                  </div>
                </div>

                {/* YouTube Button */}
                <motion.a
                  href={getYoutubeUrl(recipe.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Tutorial</span>
                </motion.a>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 md:p-8">
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-8">
                  {['ingredients', 'instructions', 'nutrition'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === tab
                          ? 'bg-white text-orange-600 shadow-lg'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Servings Adjuster */}
                {activeTab === 'ingredients' && (
                  <div className="flex items-center justify-between mb-6 p-4 bg-orange-50 rounded-2xl">
                    <span className="font-semibold text-gray-700">Adjust Servings:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setServings(Math.max(1, servings - 1))}
                        className="w-8 h-8 bg-white rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-lg w-8 text-center">{servings}</span>
                      <button
                        onClick={() => setServings(servings + 1)}
                        className="w-8 h-8 bg-white rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab Content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'ingredients' && (
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                          <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                          <span>Ingredients</span>
                        </h3>
                        <ul className="space-y-3">
                          {recipe.extendedIngredients?.map((ingredient, index) => (
                            <motion.li
                              key={ingredient.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center space-x-4 p-3 rounded-xl hover:bg-orange-50 transition-colors group"
                            >
                              <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:scale-150 transition-transform"></div>
                              <span className="text-gray-700 flex-1">
                                {adjustIngredient(ingredient, servings / recipe.servings)}
                              </span>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="w-6 h-6 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-300"
                              >
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              </motion.div>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Kitchen Tools */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                          <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                          <span>Kitchen Tools</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: 'Large Skillet', icon: '🍳' },
                            { name: 'Cutting Board', icon: '🔪' },
                            { name: 'Mixing Bowls', icon: '🥣' },
                            { name: 'Measuring Cups', icon: '📏' }
                          ].map((tool, index) => (
                            <motion.div
                              key={tool.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 + 0.5 }}
                              className="bg-gray-50 p-4 rounded-xl text-center hover:bg-blue-50 transition-colors group"
                            >
                              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                                {tool.icon}
                              </div>
                              <div className="text-sm font-medium text-gray-700">
                                {tool.name}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'instructions' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                        <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                        <span>Cooking Instructions</span>
                      </h3>
                      <ol className="space-y-4">
                        {recipe.analyzedInstructions?.[0]?.steps.map((step, index) => (
                          <motion.li
                            key={step.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg transition-all duration-300 group"
                          >
                            <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full text-sm flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                              {step.number}
                            </span>
                            <span className="text-gray-700 leading-relaxed pt-1">{step.step}</span>
                          </motion.li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {activeTab === 'nutrition' && (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                        <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                        <span>Nutrition Facts</span>
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nutritionFacts.slice(0, 6).map((nutrient, index) => (
                          <motion.div
                            key={nutrient.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 text-center border border-purple-100 hover:shadow-lg transition-all duration-300 group"
                          >
                            <div className="text-2xl font-bold text-purple-600 mb-2">
                              {nutrient.amount}{nutrient.unit}
                            </div>
                            <div className="text-sm font-medium text-gray-700 capitalize">
                              {nutrient.title.toLowerCase()}
                            </div>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mt-3 group-hover:w-16 transition-all duration-300"></div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Health Tips */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
                      >
                        <h4 className="font-bold text-yellow-800 mb-3 flex items-center space-x-2">
                          <Zap className="w-5 h-5" />
                          <span>Health Tips</span>
                        </h4>
                        <ul className="text-yellow-700 space-y-2 text-sm">
                          <li>• This recipe is high in protein and great for muscle recovery</li>
                          <li>• Consider adding more vegetables for extra fiber</li>
                          <li>• Perfect for post-workout meals</li>
                        </ul>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecipeModal;

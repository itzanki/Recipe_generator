import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ArrowLeft, Filter, Search, Trash2, Clock, 
  Users, ChefHat, Star, TrendingUp, Calendar 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../Hooks/useFavorites';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';

const Favorites = () => {
  const { favorites, removeFavorite, clearFavorites, favoritesCount } = useFavorites();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleClearFavorites = () => {
    clearFavorites();
    setShowClearConfirm(false);
  };

  // Filter and sort favorites
  const filteredAndSortedFavorites = favorites
    .filter(recipe => 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.summary.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.favoritedAt) - new Date(a.favoritedAt);
        case 'name':
          return a.title.localeCompare(b.title);
        case 'time':
          return a.readyInMinutes - b.readyInMinutes;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Advanced': 3 };
          const getDifficulty = (time) => time <= 20 ? 'Easy' : time <= 40 ? 'Medium' : 'Advanced';
          return difficultyOrder[getDifficulty(a.readyInMinutes)] - difficultyOrder[getDifficulty(b.readyInMinutes)];
        default:
          return 0;
      }
    });

  const sortOptions = [
    { value: 'recent', label: 'Most Recent', icon: Calendar },
    { value: 'name', label: 'Alphabetical', icon: TrendingUp },
    { value: 'time', label: 'Cooking Time', icon: Clock },
    { value: 'difficulty', label: 'Difficulty', icon: ChefHat }
  ];

  const getStats = () => {
    const totalTime = favorites.reduce((sum, recipe) => sum + recipe.readyInMinutes, 0);
    const averageTime = favoritesCount > 0 ? Math.round(totalTime / favoritesCount) : 0;
    const difficultyCount = {
      easy: favorites.filter(r => r.readyInMinutes <= 20).length,
      medium: favorites.filter(r => r.readyInMinutes > 20 && r.readyInMinutes <= 40).length,
      advanced: favorites.filter(r => r.readyInMinutes > 40).length
    };

    return { totalTime, averageTime, difficultyCount };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-2xl shadow-lg">
              <Heart className="text-white w-6 h-6 fill-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
              <p className="text-gray-600">
                {favoritesCount} saved recipe{favoritesCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {favoritesCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowClearConfirm(true)}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>

        {/* Stats Cards */}
        {favoritesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Recipes</p>
                  <p className="text-2xl font-bold text-gray-800">{favoritesCount}</p>
                </div>
                <div className="text-pink-500">
                  <Heart className="w-8 h-8 fill-pink-100" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg. Cook Time</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.averageTime}m</p>
                </div>
                <div className="text-orange-500">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Easy Recipes</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.difficultyCount.easy}</p>
                </div>
                <div className="text-green-500">
                  <Star className="w-8 h-8 fill-green-100" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Cook Time</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalTime}m</p>
                </div>
                <div className="text-purple-500">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter Bar */}
        {favoritesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your favorites..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all duration-300"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 focus:outline-none transition-all duration-300 appearance-none bg-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery || sortBy !== 'recent') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100"
              >
                <span className="text-sm text-gray-600">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <span>Search: "{searchQuery}"</span>
                      <button onClick={() => setSearchQuery('')}>×</button>
                    </span>
                  )}
                  {sortBy !== 'recent' && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <span>Sort: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                      <button onClick={() => setSortBy('recent')}>×</button>
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {favoritesCount === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              💔
            </motion.div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              No favorites yet
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start exploring delicious recipes and click the heart icon to save your favorites for easy access later!
            </p>
            <Link
              to="/"
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center space-x-3"
            >
              <Heart className="w-5 h-5" />
              <span>Discover Recipes</span>
            </Link>
          </motion.div>
        )}

        {/* No Results State */}
        {favoritesCount > 0 && filteredAndSortedFavorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No favorites match your search
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find your saved recipes.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSortBy('recent');
              }}
              className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Favorites Grid */}
        {filteredAndSortedFavorites.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-gray-600">
                Showing {filteredAndSortedFavorites.length} of {favoritesCount} favorite{filteredAndSortedFavorites.length !== 1 ? 's' : ''}
              </p>
              
              {filteredAndSortedFavorites.length < favoritesCount && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSortBy('recent');
                  }}
                  className="text-pink-500 hover:text-pink-600 font-medium"
                >
                  Show All Favorites
                </button>
              )}
            </motion.div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredAndSortedFavorites.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    index={index}
                    onViewRecipe={handleViewRecipe}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* Quick Actions */}
        {favoritesCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Cook?</h3>
            <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
              You have {favoritesCount} amazing recipes waiting to be cooked! Pick one and start your culinary adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const randomRecipe = favorites[Math.floor(Math.random() * favorites.length)];
                  handleViewRecipe(randomRecipe);
                }}
                className="bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center space-x-2"
              >
                <ChefHat className="w-5 h-5" />
                <span>Pick Random Recipe</span>
              </button>
              <Link
                to="/"
                className="bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors border border-pink-400 flex items-center justify-center space-x-2"
              >
                <Heart className="w-5 h-5" />
                <span>Find More Recipes</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🗑️</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Clear All Favorites?
                </h3>
                <p className="text-gray-600 mb-6">
                  This will remove all {favoritesCount} recipes from your favorites. This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearFavorites}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default Favorites;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Users, Heart, Play, Star, Zap, ChefHat, 
  Loader, AlertCircle, Trash2
} from 'lucide-react';
import { useFavorites } from "../Hooks/useFavorites";

const RecipeCard = ({ 
  recipe, 
  onViewRecipe, 
  index, 
  onRemoveFavorite,
  showRemoveButton = false 
}) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const favorite = isFavorite(recipe?.id);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!recipe?.id) return;
    
    setFavoriteLoading(true);
    try {
      if (favorite) {
        await removeFavorite(recipe.id);
      } else {
        await addFavorite(recipe);
      }
    } catch (error) {
      console.error('Favorite action failed:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    if (onRemoveFavorite && recipe?.id) {
      onRemoveFavorite(recipe.id, e);
    }
  };

  const getDifficulty = (time) => {
    const cookTime = time || 30;
    if (cookTime <= 20) return { level: 'Easy', color: 'green' };
    if (cookTime <= 40) return { level: 'Medium', color: 'yellow' };
    return { level: 'Advanced', color: 'red' };
  };

  const getYoutubeUrl = (title) => {
    const query = encodeURIComponent(`${title} recipe`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  const difficulty = getDifficulty(recipe?.readyInMinutes);

  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  };

  // Safe data access with fallbacks
  const safeTitle = recipe?.title || 'Untitled Recipe';
  const safeSummary = recipe?.summary ? 
    recipe.summary.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
    : 'No description available.';
  const safeImage = recipe?.image || '/api/placeholder/400/300';
  const safeReadyTime = recipe?.readyInMinutes || 30;
  const safeServings = recipe?.servings || 2;
  const safeDiets = recipe?.diets || [];
  const safeCuisines = recipe?.cuisines || [];

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: (index || 0) * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer border border-gray-100 hover:shadow-2xl transition-all duration-300 group w-full"
      onClick={() => recipe && onViewRecipe?.(recipe)}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
        )}
        
        {/* Error State */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <ChefHat className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
        
        {/* Recipe Image */}
        {!imageError && (
          <motion.img
            src={safeImage}
            alt={safeTitle}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col sm:flex-row gap-2">
          {/* Remove Button (for favorites page) */}
          {showRemoveButton && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemoveClick}
              className="bg-white/90 p-2 rounded-xl shadow-lg backdrop-blur-sm hover:bg-red-50 transition-all duration-300 z-10"
              title="Remove from favorites"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </motion.button>
          )}
          
          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            disabled={favoriteLoading || !recipe?.id}
            className="bg-white/90 p-2 rounded-xl shadow-lg backdrop-blur-sm hover:bg-white transition-all duration-300 z-10 disabled:opacity-50"
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favoriteLoading ? (
              <Loader className="w-4 h-4 animate-spin text-gray-600" />
            ) : (
              <motion.div
                animate={{ 
                  scale: favorite ? [1, 1.3, 1] : 1 
                }}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  className={`w-4 h-4 transition-all duration-300 ${
                    favorite 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-gray-600 hover:text-red-500'
                  }`} 
                />
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (index || 0) * 0.1 + 0.2 }}
            className={`px-2 py-1 rounded-full text-xs font-bold border ${colorClasses[difficulty.color]} backdrop-blur-sm`}
          >
            {difficulty.level}
          </motion.span>
        </div>

        {/* Quick Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index || 0) * 0.1 + 0.3 }}
          className="absolute bottom-3 left-3 right-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-white">
              <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-semibold">{safeReadyTime}m</span>
              </div>
              <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                <Users className="w-3 h-3" />
                <span className="text-xs font-semibold">{safeServings}</span>
              </div>
            </div>
            
            {/* YouTube Button */}
            <motion.a
              href={getYoutubeUrl(safeTitle)}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg backdrop-blur-sm"
              title="Watch tutorial on YouTube"
            >
              <Play className="w-3 h-3" />
            </motion.a>
          </div>
        </motion.div>

        {/* Hover Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-[1px]"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        {/* Recipe Title */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index || 0) * 0.1 + 0.4 }}
          className="font-bold text-lg sm:text-xl text-gray-800 mb-2 sm:mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors duration-300 min-h-[3.5rem] flex items-center"
        >
          {safeTitle}
        </motion.h3>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index || 0) * 0.1 + 0.5 }}
          className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed min-h-[3rem]"
        >
          {safeSummary}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index || 0) * 0.1 + 0.6 }}
          className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4"
        >
          {safeDiets.slice(0, 2).map((diet, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium"
            >
              {diet}
            </span>
          ))}
          {safeCuisines.slice(0, 1).map((cuisine, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
            >
              {cuisine}
            </span>
          ))}
          
          {/* Generated Badge */}
          {recipe?.isAI && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              👩🏻‍🍳
            </span>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (index || 0) * 0.1 + 0.7 }}
          className="flex items-center justify-between"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group/btn text-sm sm:text-base"
          >
            <ChefHat className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
            <span>View Recipe</span>
          </motion.button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index || 0) * 0.1 + 0.8 }}
          className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100"
        >
          <div className="flex items-center space-x-1 text-gray-500">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs font-medium">{safeReadyTime}m cook</span>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-500">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">
              {recipe?.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : '4.8'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Shimmer Effect on Hover */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 400 : -100
        }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 pointer-events-none"
      />

      {/* Mobile Touch Feedback */}
      <div className="absolute inset-0 bg-black opacity-0 group-active:opacity-5 transition-opacity duration-150 rounded-3xl pointer-events-none" />
    </motion.div>
  );
};

export default RecipeCard;
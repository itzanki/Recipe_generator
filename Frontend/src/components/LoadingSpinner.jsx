import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Utensils, Clock, Sparkles, AlertCircle } from 'lucide-react';

const LoadingSpinner = ({ 
  type = "recipes", 
  message = null, 
  progress = null,
  error = null,
  onRetry = null 
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const loadingMessages = {
    recipes: [
      "Chopping vegetables...",
      "Preheating the oven...",
      "Mixing ingredients...",
      "Adding secret spices...",
      "Final touches...",
      "Plating your delicious meal..."
    ],
    search: [
      "Searching our recipe database...",
      "Finding perfect matches...",
      "Filtering by your preferences...",
      "Checking ingredient availability...",
      "Almost there...",
      "Finalizing your results..."
    ],
    ai: [
      "Consulting with Chef...",
      "Analyzing your ingredients...",
      "Creating unique recipe combinations...",
      "Balancing flavors...",
      "Writing cooking instructions...",
      "Adding creative twists..."
    ],
    favorites: [
      "Loading your favorite recipes...",
      "Checking for new updates...",
      "Organizing your collection...",
      "Almost ready..."
    ],
    general: [
      "Loading delicious content...",
      "Preparing something special...",
      "Getting things ready...",
      "Just a moment..."
    ]
  };

  const messages = message ? [message] : loadingMessages[type] || loadingMessages.general;

  // Rotate through messages
  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [messages.length]);

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-red-100 p-6 rounded-3xl mb-6"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 text-lg mb-6 max-w-md">
          {error.message || "We couldn't load the content. Please check your connection and try again."}
        </p>

        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            Try Again
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Animated Chef Container */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative mb-8"
      >
        {/* Main Chef Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-3xl shadow-2xl"
        >
          <ChefHat className="text-white w-12 h-12" />
        </motion.div>

        {/* Floating Utensils */}
        <motion.div
          animate={{ 
            x: [-20, 20, -20],
            y: [-10, 10, -10],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-2 -left-2 bg-yellow-500 p-2 rounded-full shadow-lg"
        >
          <Utensils className="text-white w-4 h-4" />
        </motion.div>

        <motion.div
          animate={{ 
            x: [20, -20, 20],
            y: [10, -10, 10],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }}
          className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full shadow-lg"
        >
          <Clock className="text-white w-4 h-4" />
        </motion.div>

        {/* Sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (i - 1) * 40],
              y: [0, -30]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2"
          >
            <Sparkles className="text-yellow-300 w-4 h-4" />
          </motion.div>
        ))}
      </motion.div>

      {/* Loading Messages */}
      <div className="text-center mb-8">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          {type === 'ai' ? 'Chef is Cooking...' : 
           type === 'search' ? 'Finding Recipes...' : 
           type === 'favorites' ? 'Loading Favorites...' : 
           'Cooking up something special...'}
        </motion.h3>
        
        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-gray-600 text-lg font-medium"
            >
              {messages[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-64 bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: progress !== null ? `${progress}%` : "100%" }}
          transition={{ 
            duration: progress !== null ? 0.5 : 2,
            repeat: progress === null ? Infinity : 0,
            ease: "easeInOut"
          }}
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full relative"
        >
          {/* Shimmer Effect */}
          <motion.div
            animate={{ x: [-100, 300] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12"
          />
        </motion.div>
      </div>

      {/* Progress Percentage */}
      {progress !== null && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 text-sm font-medium mb-4"
        >
          {progress}% complete
        </motion.p>
      )}

      {/* Cooking Steps Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center space-x-6 mt-6"
      >
        {['🥬', '🔪', '🍳', '🍽️'].map((emoji, index) => (
          <motion.div
            key={index}
            animate={{ 
              scale: [1, 1.2, 1],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.3
            }}
            className="text-2xl"
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>

      {/* Type-specific tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-200 max-w-md"
      >
        <p className="text-orange-800 text-sm text-center font-medium">
          {type === 'ai' ? '💡 Chief Tip: The more specific your ingredients, the better the recipe!' :
           type === 'search' ? '💡 Try searching by cuisine, diet, or cooking time!' :
           type === 'favorites' ? '💡 You can organize favorites by difficulty or cooking time!' :
           '💡 Did you know? Adding a pinch of salt to coffee reduces bitterness!'}
        </p>
      </motion.div>

      {/* Estimated Time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-4 flex items-center space-x-2 text-gray-500 text-sm"
      >
        <Clock className="w-4 h-4" />
        <span>
          {type === 'ai' ? 'Generation may take 10-30 seconds' :
           type === 'search' ? 'Usually takes 2-5 seconds' :
           'Loading...'}
        </span>
      </motion.div>
    </motion.div>
  );
};

// Specific loading components with pre-configured types
export const RecipeLoading = (props) => <LoadingSpinner type="recipes" {...props} />;
export const SearchLoading = (props) => <LoadingSpinner type="search" {...props} />;
export const AILoading = (props) => <LoadingSpinner type="ai" {...props} />;
export const FavoritesLoading = (props) => <LoadingSpinner type="favorites" {...props} />;
export const GeneralLoading = (props) => <LoadingSpinner type="general" {...props} />;

// Loading spinner for API operations
export const APILoading = ({ operation, progress, error, onRetry }) => (
  <LoadingSpinner
    type={operation || "general"}
    progress={progress}
    error={error}
    onRetry={onRetry}
  />
);

export default LoadingSpinner;
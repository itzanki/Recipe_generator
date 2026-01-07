import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, TrendingUp, Clock, Star, Users,
  ChefHat, Globe, Zap, Heart, Play} from 'lucide-react';
import { useRecipes } from '../Hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import RecipeModal from '../components/RecipeModal';

const Explore = () => {
  const { recipes, loading, searchByQuery, getRandom } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('trending');

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const categories = [
    { id: 'trending', label: 'Trending Now', icon: TrendingUp, color: 'red' },
    { id: 'quick', label: 'Quick & Easy', icon: Zap, color: 'green' },
    { id: 'healthy', label: 'Healthy Choices', icon: Heart, color: 'blue' },
    { id: 'chef', label: "Chef's Picks", icon: ChefHat, color: 'purple' },
    { id: 'global', label: 'Global Cuisine', icon: Globe, color: 'orange' },
    { id: 'desserts', label: 'Sweet Treats', icon: Star, color: 'pink' }
  ];

  const trendingRecipes = [
    {
      id: 1,
      title: "One-Pan Lemon Herb Chicken",
      image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop",
      readyInMinutes: 25,
      servings: 4,
      summary: "Juicy chicken with fresh herbs and lemon, all cooked in one pan for easy cleanup.",
      rating: 4.8,
      cookCount: 1250
    },
    {
      id: 2,
      title: "Vegetable Buddha Bowl",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      readyInMinutes: 20,
      servings: 2,
      summary: "Colorful bowl packed with fresh vegetables, grains, and a tahini dressing.",
      rating: 4.6,
      cookCount: 890
    },
    {
      id: 3,
      title: "Creamy Mushroom Pasta",
      image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=300&fit=crop",
      readyInMinutes: 30,
      servings: 3,
      summary: "Rich and creamy pasta with wild mushrooms and parmesan cheese.",
      rating: 4.9,
      cookCount: 2100
    }
  ];

  const chefPicks = [
    {
      id: 4,
      title: "Beef Wellington",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      readyInMinutes: 90,
      servings: 6,
      summary: "Classic British dish with tender beef wrapped in puff pastry.",
      rating: 4.9,
      cookCount: 450,
      chef: "Gordon Ramsay"
    },
    {
      id: 5,
      title: "Fresh Spring Rolls",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
      readyInMinutes: 40,
      servings: 4,
      summary: "Light and refreshing Vietnamese spring rolls with peanut sauce.",
      rating: 4.7,
      cookCount: 780,
      chef: "Jamie Oliver"
    }
  ];

  const quickRecipes = [
    {
      id: 6,
      title: "15-Minute Stir Fry",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      readyInMinutes: 15,
      servings: 2,
      summary: "Quick vegetable stir fry with your choice of protein.",
      rating: 4.5,
      cookCount: 3200
    },
    {
      id: 7,
      title: "Avocado Toast",
      image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
      readyInMinutes: 10,
      servings: 1,
      summary: "Simple yet delicious avocado toast with various toppings.",
      rating: 4.4,
      cookCount: 5600
    }
  ];

  const getRecipesForCategory = (categoryId) => {
    switch (categoryId) {
      case 'trending': return trendingRecipes;
      case 'quick': return quickRecipes;
      case 'chef': return chefPicks;
      default: return [...trendingRecipes, ...chefPicks, ...quickRecipes].slice(0, 6);
    }
  };

  const featuredCollections = [
    {
      title: "Weeknight Dinners",
      description: "Quick and delicious meals for busy evenings",
      recipeCount: 45,
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop",
      color: "blue"
    },
    {
      title: "Meal Prep Masters",
      description: "Plan your week with these make-ahead recipes",
      recipeCount: 32,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
      color: "green"
    },
    {
      title: "Date Night Specials",
      description: "Impressive dishes for romantic evenings",
      recipeCount: 28,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
      color: "purple"
    },
    {
      title: "Family Favorites",
      description: "Crowd-pleasers for the whole family",
      recipeCount: 67,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop",
      color: "orange"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Explore Recipes
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover new flavors, trending dishes, and chef-recommended recipes from around the world.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for recipes, ingredients, or chefs..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-300 shadow-lg"
            />
            <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide"
        >
          <div className="flex space-x-4 px-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category.id
                    ? `bg-${category.color}-500 text-white shadow-lg`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Featured Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCollections.map((collection, index) => (
              <motion.div
                key={collection.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer group"
              >
                <div className="relative h-32 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2">{collection.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{collection.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{collection.recipeCount} recipes</span>
                    <button className="text-indigo-500 hover:text-indigo-600 font-semibold">
                      Explore →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Category Content */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {categories.find(c => c.id === activeCategory)?.label}
            </h2>
            <button className="text-indigo-500 hover:text-indigo-600 font-semibold flex items-center space-x-2">
              <span>View All</span>
              <Play className="w-4 h-4" />
            </button>
          </div>

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRecipesForCategory(activeCategory).map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={index}
                onViewRecipe={handleViewRecipe}
              />
            ))}
          </div>
        </motion.div>

        {/* Special Sections */}
        {activeCategory === 'trending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Most Cooked */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <span>Most Cooked This Week</span>
                </h3>
                <div className="space-y-4">
                  {trendingRecipes.slice(0, 3).map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors cursor-pointer"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{recipe.readyInMinutes}m</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{recipe.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{recipe.cookCount}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Chef's Corner */}
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-6 flex items-center space-x-2">
                  <ChefHat className="w-5 h-5" />
                  <span>Chef's Corner</span>
                </h3>
                <div className="space-y-4">
                  {chefPicks.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-colors cursor-pointer"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{recipe.title}</h4>
                        <div className="flex items-center space-x-1 text-xs">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{recipe.rating}</span>
                        </div>
                      </div>
                      <p className="text-white/80 text-xs mb-2">{recipe.summary}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>By {recipe.chef}</span>
                        <span>{recipe.readyInMinutes} minutes</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Cooking Tips & Tricks
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔪',
                title: 'Knife Skills',
                tip: 'Keep your knives sharp and learn proper cutting techniques for faster prep.'
              },
              {
                icon: '🌡️',
                title: 'Temperature Control',
                tip: 'Use a meat thermometer to ensure perfect doneness every time.'
              },
              {
                icon: '🧂',
                title: 'Seasoning Secrets',
                tip: 'Season in layers and taste as you go for perfectly balanced flavors.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center p-4"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
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

export default Explore;

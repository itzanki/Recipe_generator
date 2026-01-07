const API_BASE_URL = 'http://localhost:5000/api';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('flavorcraft-token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: credentials
  }),
  signup: (userData) => apiCall('/auth/signup', {
    method: 'POST',
    body: userData
  }),
  getProfile: () => apiCall('/auth/profile')
};

// Recipes API
export const recipesAPI = {
  search: (query, filters = {}) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (filters.dietary && filters.dietary.length > 0) params.append('dietary', filters.dietary.join(','));
    if (filters.cuisine) params.append('cuisine', filters.cuisine);
    if (filters.mealType) params.append('mealType', filters.mealType);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.maxReadyTime) params.append('maxReadyTime', filters.maxReadyTime);
    
    return apiCall(`/recipes/search?${params}`);
  },
  
  searchByIngredients: (ingredients, filters = {}) => 
    apiCall('/recipes/ingredients-search', {
      method: 'POST',
      body: { 
        ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
        filters 
      }
    }),
  
  generateAIRecipe: (ingredients, preferences = {}) => 
    apiCall('/recipes/generate', {
      method: 'POST',
      body: { 
        ingredients: Array.isArray(ingredients) ? ingredients : [ingredients],
        preferences 
      }
    }),
  
  getRandom: () => apiCall('/recipes/random'),
  getById: (id) => apiCall(`/recipes/${id}`)
};

// Favorites API
export const favoritesAPI = {
  getAll: () => apiCall('/favorites'),
  add: (recipeId, recipeData) => apiCall(`/favorites/${recipeId}`, {
    method: 'POST',
    body: recipeData // Send the complete recipe data
  }),
  remove: (recipeId) => apiCall(`/favorites/${recipeId}`, {
    method: 'DELETE'
  }),
  check: (recipeId) => apiCall(`/favorites/${recipeId}/check`)
};

// Users API
export const usersAPI = {
  updateProfile: (profileData) => apiCall('/users/profile', {
    method: 'PUT',
    body: profileData
  }),
  getStats: () => apiCall('/users/stats')
};

// Health check
export const healthCheck = () => apiCall('/health');
import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoritesAPI } from '../utils/api';
import { useAuth } from './useAuth';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        const response = await favoritesAPI.getAll();
        
        // Handle different response formats
        let favoritesData = [];
        if (Array.isArray(response)) {
          favoritesData = response;
        } else if (response.data && Array.isArray(response.data)) {
          favoritesData = response.data;
        } else if (response.favorites && Array.isArray(response.favorites)) {
          favoritesData = response.favorites;
        }
        
        setFavorites(favoritesData);
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const addFavorite = async (recipe) => {
    try {
      const recipeId = recipe.id || recipe._id;
      await favoritesAPI.add(recipeId);
      
      const newFavorite = {
        ...recipe,
        favoritedAt: new Date().toISOString()
      };
      
      setFavorites(prev => [...prev, newFavorite]);
      return newFavorite;
    } catch (error) {
      console.error('Failed to add favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      await favoritesAPI.remove(recipeId);
      setFavorites(prev => prev.filter(fav => 
        (fav.id !== recipeId && fav._id !== recipeId)
      ));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      throw error;
    }
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => 
      fav.id === recipeId || fav._id === recipeId
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const checkFavoriteStatus = async (recipeId) => {
    try {
      const response = await favoritesAPI.check(recipeId);
      return response.data?.isFavorite || response.isFavorite || false;
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      return false;
    }
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    checkFavoriteStatus,
    favoritesCount: favorites.length,
    loading
  };

  return React.createElement(FavoritesContext.Provider, { value }, children);
};
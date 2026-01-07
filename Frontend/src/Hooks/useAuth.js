import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, usersAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('flavorcraft-token');
      const savedUser = localStorage.getItem('flavorcraft-user');
      
      if (token && savedUser) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data.user);
        } catch (error) {
          console.error('Auto-login failed:', error);
          localStorage.removeItem('flavorcraft-token');
          localStorage.removeItem('flavorcraft-user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    try {
      const response = await authAPI.login(userData);
      const { user: userInfo, token } = response.data;
      
      setUser(userInfo);
      localStorage.setItem('flavorcraft-token', token);
      localStorage.setItem('flavorcraft-user', JSON.stringify(userInfo));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const { user: userInfo, token } = response.data;
      
      setUser(userInfo);
      localStorage.setItem('flavorcraft-token', token);
      localStorage.setItem('flavorcraft-user', JSON.stringify(userInfo));
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flavorcraft-token');
    localStorage.removeItem('flavorcraft-user');
    localStorage.removeItem('flavorcraft-favorites');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await usersAPI.updateProfile(updatedData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('flavorcraft-user', JSON.stringify(updatedUser));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      localStorage.setItem('flavorcraft-user', JSON.stringify(response.data.user));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
    loading
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};
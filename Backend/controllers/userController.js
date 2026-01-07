import User from '../models/User.js';
import Favorite from '../models/Favorite.js';
import Recipe from '../models/Recipe.js';
import fs from 'fs';
import path from 'path';

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, preferences, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;
    if (preferences) {
      updateData.preferences = { 
        ...req.user.preferences, 
        ...preferences 
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: `/uploads/avatars/${req.file.filename}` },
      { new: true }
    );

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar'
    });
  }
};

export const removeAvatar = async (req, res) => {
  try {
    // Remove current avatar file if exists
    if (req.user.avatar && req.user.avatar.startsWith('/uploads/avatars/')) {
      const filename = path.basename(req.user.avatar);
      const filePath = path.join('uploads', 'avatars', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: '' },
      { new: true }
    );

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Remove avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove avatar'
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    // Remove user's avatar if exists
    if (req.user.avatar && req.user.avatar.startsWith('/uploads/avatars/')) {
      const filename = path.basename(req.user.avatar);
      const filePath = path.join('uploads', 'avatars', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete user's favorites
    await Favorite.deleteMany({ user: req.user._id });
    
    // Delete user's recipes
    await Recipe.deleteMany({ createdBy: req.user._id });
    
    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const favoritesCount = await Favorite.countDocuments({ user: req.user._id });
    const userRecipesCount = await Recipe.countDocuments({ createdBy: req.user._id });
    
    res.json({
      success: true,
      data: {
        favoritesCount,
        userRecipesCount,
        recipesCooked: req.user.stats?.recipesCooked || 0,
        averageRating: req.user.stats?.averageRating || 0
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats'
    });
  }
};
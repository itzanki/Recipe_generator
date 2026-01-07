import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Calendar, ChefHat, Award, Clock, 
  Heart, Star, TrendingUp, Settings, Edit3,
  LogOut, BookOpen, Target, Zap, Camera,
  Trash2, AlertCircle, Save, X, Upload, Loader
} from 'lucide-react';
import { useAuth } from "../Hooks/useAuth";
import { useFavorites } from "../Hooks/useFavorites";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, updateProfile, uploadAvatar, removeAvatar, deleteAccount } = useAuth();
  const { favoritesCount } = useFavorites();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    cookingLevel: 'intermediate',
    avatar: ''
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize edit data when user loads
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        bio: user.bio || 'Food enthusiast and home cook 🍳',
        cookingLevel: user.preferences?.cookingLevel || 'intermediate',
        avatar: user.avatar || '👨‍🍳'
      });
    }
  }, [user]);

  // Fetch user stats and data
  useEffect(() => {
    fetchUserStats();
    fetchAchievements();
    fetchRecentActivity();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Simulated API call - replace with actual API
      setStats({
        favoritesCount: favoritesCount,
        recipesCooked: 156,
        averageRating: 4.8,
        badgesEarned: 12,
        userRecipesCount: 5
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        favoritesCount: favoritesCount,
        recipesCooked: 156,
        averageRating: 4.8,
        badgesEarned: 12,
        userRecipesCount: 0
      });
    }
  };

  const fetchAchievements = async () => {
    try {
      setAchievements([
        { icon: '🔥', name: 'Hot Streak', description: 'Cooked 7 days in a row', progress: 100, unlocked: true },
        { icon: '🌱', name: 'Green Thumb', description: '10 vegetarian recipes', progress: 80, unlocked: false },
        { icon: '⚡', name: 'Quick Cook', description: '5 recipes under 20min', progress: 60, unlocked: false },
        { icon: '🌍', name: 'World Traveler', description: 'Cooked 5 cuisines', progress: 40, unlocked: false },
        { icon: '👑', name: 'Recipe Master', description: 'Created 10 recipes', progress: 30, unlocked: false }
      ]);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      setRecentActivity([
        { action: 'saved', recipe: 'Creamy Garlic Chicken', time: '2 hours ago', icon: '💖' },
        { action: 'cooked', recipe: 'Vegetable Stir Fry', time: '1 day ago', icon: '🍳' },
        { action: 'rated', recipe: 'Classic Beef Burger', time: '2 days ago', icon: '⭐' },
        { action: 'shared', recipe: 'Chocolate Cake', time: '3 days ago', icon: '📤' },
        { action: 'created', recipe: 'My Special Pasta', time: '1 week ago', icon: '✨' }
      ]);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      bio: user?.bio || 'Food enthusiast and home cook 🍳',
      cookingLevel: user?.preferences?.cookingLevel || 'intermediate',
      avatar: user?.avatar || '👨‍🍳'
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setIsEditing(false);
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    try {
      setAvatarLoading(true);
      await uploadAvatar(avatarFile);
      setAvatarFile(null);
      setAvatarPreview('');
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      setAvatarLoading(true);
      await removeAvatar();
      alert('Avatar removed successfully!');
    } catch (error) {
      console.error('Avatar remove error:', error);
      alert('Failed to remove avatar. Please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      alert('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Account deletion error:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const cookingLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱', description: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', icon: '🍳', description: 'Comfortable in kitchen' },
    { value: 'advanced', label: 'Advanced', icon: '👨‍🍳', description: 'Experienced cook' },
    { value: 'expert', label: 'Expert', icon: '🌟', description: 'Master chef' }
  ];

  const statCards = [
    { 
      icon: Heart, 
      label: 'Favorite Recipes', 
      value: stats?.favoritesCount || favoritesCount, 
      color: 'red', 
      change: '+5' 
    },
    { 
      icon: Clock, 
      label: 'Recipes Cooked', 
      value: stats?.recipesCooked || '156', 
      color: 'blue', 
      change: '+12' 
    },
    { 
      icon: Star, 
      label: 'Average Rating', 
      value: stats?.averageRating || '4.8', 
      color: 'yellow', 
      change: '+0.2' 
    },
    { 
      icon: Award, 
      label: 'Badges Earned', 
      value: stats?.badgesEarned || '12', 
      color: 'purple', 
      change: '+2' 
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600">Manage your account and cooking preferences</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isEditing ? (
                <X className="w-4 h-4" />
              ) : (
                <Edit3 className="w-4 h-4" />
              )}
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <motion.div
                    whileHover={{ scale: isEditing ? 1.05 : 1 }}
                    className="relative"
                  >
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-4xl overflow-hidden">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : user.avatar ? (
                        <img 
                          src={`http://localhost:5000${user.avatar}`} 
                          alt="Profile avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <span>{editData.avatar}</span>
                      )}
                      {!user.avatar && !avatarPreview && (
                        <span className="flex items-center justify-center w-full h-full">
                          {editData.avatar}
                        </span>
                      )}
                    </div>
                    
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={triggerFileInput}
                        disabled={avatarLoading}
                        className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      >
                        {avatarLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                      </motion.button>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      className="hidden"
                    />
                  </motion.div>
                  
                  {/* Avatar Actions */}
                  {isEditing && (
                    <div className="flex flex-col space-y-2 w-full">
                      {avatarPreview && (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAvatarUpload}
                            disabled={avatarLoading}
                            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                          >
                            {avatarLoading ? (
                              <Loader className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            <span>Save</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setAvatarFile(null);
                              setAvatarPreview('');
                            }}
                            className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        </div>
                      )}
                      
                      {user.avatar && !avatarPreview && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAvatarRemove}
                          disabled={avatarLoading}
                          className="w-full bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-1"
                        >
                          {avatarLoading ? (
                            <Loader className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          <span>Remove Avatar</span>
                        </motion.button>
                      )}
                      
                      {!user.avatar && !avatarPreview && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={triggerFileInput}
                          className="w-full bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Photo</span>
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Profile Information */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={editData.bio}
                          onChange={(e) => setEditData({...editData, bio: e.target.value})}
                          rows="3"
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
                          placeholder="Tell us about your cooking journey..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {user.bio || 'Food enthusiast and home cook 🍳'}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(user.joinDate || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cooking Level */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <ChefHat className="w-5 h-5 text-blue-500" />
                  <span>Cooking Level</span>
                </h3>
                
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {cookingLevels.map((level) => (
                      <motion.button
                        key={level.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEditData({...editData, cookingLevel: level.value})}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          editData.cookingLevel === level.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{level.icon}</div>
                        <div className="font-semibold text-sm">{level.label}</div>
                        <div className="text-xs text-gray-500">{level.description}</div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-3xl">
                      {cookingLevels.find(l => l.value === user.preferences?.cookingLevel)?.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-lg">
                        {cookingLevels.find(l => l.value === user.preferences?.cookingLevel)?.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {cookingLevels.find(l => l.value === user.preferences?.cookingLevel)?.description}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 pt-6 border-t border-gray-100"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'red' ? 'bg-red-100' :
                      stat.color === 'blue' ? 'bg-blue-100' :
                      stat.color === 'yellow' ? 'bg-yellow-100' : 'bg-purple-100'
                    }`}>
                      <stat.icon className={`w-5 h-5 ${
                        stat.color === 'red' ? 'text-red-600' :
                        stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.color === 'red' ? 'text-red-600 bg-red-50' :
                      stat.color === 'blue' ? 'text-blue-600 bg-blue-50' :
                      stat.color === 'yellow' ? 'text-yellow-600 bg-yellow-50' : 'text-purple-600 bg-purple-50'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Recent Activity</span>
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <div className="text-2xl transform group-hover:scale-110 transition-transform">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 capitalize">
                        {activity.action} <span className="text-blue-600">{activity.recipe}</span>
                      </div>
                      <div className="text-sm text-gray-500">{activity.time}</div>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-red-200"
            >
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Danger Zone</span>
              </h3>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 mb-4">
                  Once you delete your account, there is no going back. All your data, including recipes, favorites, and preferences will be permanently removed.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={loading}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/favorites')}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Back to Safety</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Achievements & Goals */}
          <div className="space-y-8">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-500" />
                <span>Achievements</span>
              </h3>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      achievement.unlocked
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`text-2xl transform ${achievement.unlocked ? 'scale-110' : 'scale-100'} transition-transform`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold ${
                          achievement.unlocked ? 'text-purple-700' : 'text-gray-700'
                        }`}>
                          {achievement.name}
                        </div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-2 rounded-full ${
                          achievement.unlocked ? 'bg-purple-500' : 'bg-blue-500'
                        }`}
                      />
                    </div>
                    
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {achievement.progress}% complete
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white"
            >
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/favorites')}
                  className="w-full bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors flex items-center space-x-3"
                >
                  <Heart className="w-5 h-5" />
                  <span>View Favorites</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="w-full bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors flex items-center space-x-3"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Find Recipes</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/explore')}
                  className="w-full bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors flex items-center space-x-3"
                >
                  <Target className="w-5 h-5" />
                  <span>Explore</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
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
                Delete Your Account?
              </h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. All your data including recipes, favorites, and preferences will be permanently deleted.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAccountDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;
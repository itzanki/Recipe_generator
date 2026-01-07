import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Calendar, Edit3, Save, X, Camera,
  ChefHat, Award, Clock, Heart, Star, TrendingUp
} from 'lucide-react';

const UserProfile = ({ user, onUpdateProfile, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Food enthusiast and home cook 🍳',
    cookingLevel: user?.preferences?.cookingLevel || 'intermediate'
  });
  const [avatar, setAvatar] = useState(user?.avatar || '👨‍🍳');

  const cookingLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱', description: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', icon: '🍳', description: 'Comfortable in kitchen' },
    { value: 'advanced', label: 'Advanced', icon: '👨‍🍳', description: 'Experienced cook' },
    { value: 'expert', label: 'Expert', icon: '🌟', description: 'Master chef' }
  ];

  const avatars = ['👨‍🍳', '👩‍🍳', '🧑‍🍳', '🐰', '🐼', '🦊', '🐯', '🐶'];

  const stats = [
    { icon: Heart, label: 'Favorite Recipes', value: '24', color: 'red' },
    { icon: Clock, label: 'Recipes Cooked', value: '156', color: 'blue' },
    { icon: Star, label: 'Average Rating', value: '4.8', color: 'yellow' },
    { icon: Award, label: 'Badges Earned', value: '12', color: 'purple' }
  ];

  const recentAchievements = [
    { icon: '🔥', name: 'Hot Streak', description: 'Cooked 7 days in a row' },
    { icon: '🌱', name: 'Green Thumb', description: '10 vegetarian recipes' },
    { icon: '⚡', name: 'Quick Cook', description: '5 recipes under 20min' }
  ];

  const handleSave = () => {
    onUpdateProfile({
      ...user,
      ...formData,
      avatar: avatar,
      preferences: {
        ...user?.preferences,
        cookingLevel: formData.cookingLevel
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || 'Food enthusiast and home cook 🍳',
      cookingLevel: user?.preferences?.cookingLevel || 'intermediate'
    });
    setAvatar(user?.avatar || '👨‍🍳');
    setIsEditing(false);
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <div className="text-4xl bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                {avatar}
              </div>
              {isEditing && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 bg-white text-purple-600 p-1 rounded-full shadow-lg"
                >
                  <Camera className="w-3 h-3" />
                </motion.button>
              )}
            </motion.div>
            
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="text-2xl font-bold bg-white/20 rounded-lg px-3 py-1 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50"
                />
              ) : (
                <h2 className="text-2xl font-bold">{user?.name}</h2>
              )}
              <p className="text-white/80 flex items-center space-x-2 mt-1">
                <ChefHat className="w-4 h-4" />
                <span>Food Enthusiast</span>
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-white text-purple-600 px-6 py-2 rounded-xl font-semibold hover:bg-white/90 transition-colors flex items-center space-x-2"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </motion.button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Avatar Selection */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <h3 className="font-semibold text-gray-800 mb-3">Choose Avatar</h3>
                <div className="grid grid-cols-8 gap-2">
                  {avatars.map((av) => (
                    <motion.button
                      key={av}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setAvatar(av)}
                      className={`text-2xl p-2 rounded-xl transition-all duration-300 ${
                        avatar === av 
                          ? 'bg-purple-500 text-white shadow-lg' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {av}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                          />
                        ) : (
                          <p className="font-medium">{user?.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500"
                          />
                        ) : (
                          <p className="font-medium">{user?.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">Member Since</label>
                        <p className="font-medium">{formatJoinDate(user?.joinDate)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Cooking Level */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Cooking Level</h3>
                  
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-3">
                      {cookingLevels.map((level) => (
                        <motion.button
                          key={level.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({...formData, cookingLevel: level.value})}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            formData.cookingLevel === level.value
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
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
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="text-3xl">
                        {cookingLevels.find(l => l.value === formData.cookingLevel)?.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {cookingLevels.find(l => l.value === formData.cookingLevel)?.label}
                        </div>
                        <div className="text-sm text-gray-600">
                          {cookingLevels.find(l => l.value === formData.cookingLevel)?.description}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Stats & Achievements */}
              <div className="space-y-6">
                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200"
                >
                  <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Your Stats</span>
                  </h3>
                  
                  <div className="grid gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                            <stat.icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-700">{stat.label}</span>
                        </div>
                        <span className="font-bold text-gray-800">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Achievements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200"
                >
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">Recent Achievements</h3>
                  
                  <div className="space-y-3">
                    {recentAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm">
                            {achievement.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {achievement.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex space-x-3 mt-6 pt-6 border-t border-gray-200"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;
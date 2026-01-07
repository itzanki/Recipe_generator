import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  recipeId: { 
    type: String,
    required: true
  },
  source: { 
    type: String,
    enum: ['local', 'themealdb'],
    default: 'local'
  },
  favoritedAt: {
    type: Date,
    default: Date.now
  }
});

favoriteSchema.index({ user: 1, recipeId: 1, source: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: String,
  carbohydrates: String,
  fat: String,
  fiber: String,
  sugar: String
});

const ingredientSchema = new mongoose.Schema({
  original: String,
  amount: Number,
  unit: String,
  name: String
});

const instructionSchema = new mongoose.Schema({
  number: Number,
  step: String
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'
  },
  readyInMinutes: {
    type: Number,
    required: true
  },
  servings: {
    type: Number,
    required: true
  },
  summary: String,
  extendedIngredients: [ingredientSchema],
  analyzedInstructions: [{
    steps: [instructionSchema]
  }],
  nutrition: nutritionSchema,
  diets: [String],
  cuisines: [String],
  dishTypes: [String],
  source: {
    type: String,
    enum: ['user', 'ai', 'external'],
    default: 'ai'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  rating: {
    average: { type: Number, default: 4.5 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});


recipeSchema.index({ title: 'text', summary: 'text' });

export default mongoose.model('Recipe', recipeSchema);
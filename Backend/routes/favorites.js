import express from 'express';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite
} from '../controllers/favoriteController.js'; // Fixed import path
import { authenticate } from '../middleware/auth.js'; // Fixed import path

const router = express.Router();

router.get('/', authenticate, getFavorites);
router.post('/:recipeId', authenticate, addFavorite);
router.delete('/:recipeId', authenticate, removeFavorite);
router.get('/:recipeId/check', authenticate, isFavorite);

export default router;
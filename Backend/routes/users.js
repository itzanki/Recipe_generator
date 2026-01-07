import express from 'express';
import { 
  updateProfile, 
  uploadAvatar, 
  removeAvatar, 
  deleteAccount, 
  getUserStats 
} from '../controllers/userController.js'; 
import { authenticate } from '../middleware/auth.js'; 

const router = express.Router();

router.put('/profile', authenticate, updateProfile);
router.get('/stats', authenticate, getUserStats);

export default router;
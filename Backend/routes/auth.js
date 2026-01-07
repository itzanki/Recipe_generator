import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js'; // Fixed import path
import { validateSignup, validateLogin } from '../middleware/validation.js'; // Fixed import path
import { authenticate } from '../middleware/auth.js'; // Fixed import path

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);

export default router;
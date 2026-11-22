import express from 'express';
import { loginUser, registerUser, updateUserProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);
router.route('/profile').put(protect, updateUserProfile).patch(protect, updateUserProfile);

export default router;

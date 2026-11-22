import express from 'express';
import { getUsers, getUserById, getUserProfile, updateUserProfile, getUserSettings, updateUserSettings, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getUsers);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .patch(protect, updateUserProfile);

router.route('/change-password')
    .put(protect, changePassword);

router.route('/settings')
    .get(protect, getUserSettings)
    .put(protect, updateUserSettings);

router.route('/:id').get(protect, getUserById);

export default router;

import express from 'express';
import {
    getMyApplications,
    updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/applications/my - Influencer queries their applications
router.route('/my').get(protect, requireRole('influencer'), getMyApplications);

// PATCH /api/applications/:id/status - Business updates status
router.route('/:id/status').patch(protect, requireRole('business'), updateApplicationStatus);

export default router;

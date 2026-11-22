import express from 'express';
import { getOffers, createOffer, getMyOffers, getOfferById } from '../controllers/offerController.js';
import { applyToOffer, getOfferApplications } from '../controllers/applicationController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getOffers)
    .post(protect, requireRole('business'), createOffer);

router.route('/my').get(protect, requireRole('business'), getMyOffers);

router.route('/:id').get(protect, getOfferById);

// Application endpoints for offers
router.route('/:id/apply').post(protect, requireRole('influencer'), applyToOffer);
router.route('/:id/applications').get(protect, requireRole('business'), getOfferApplications);

export default router;

import asyncHandler from 'express-async-handler';
import Offer from '../models/Offer.js';

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Private (or Public depending on requirements, usually Private for this platform)
const getOffers = asyncHandler(async (req, res) => {
    const offers = await Offer.find({ status: 'active' }).populate('businessId', 'name email');
    res.json(offers);
});

// @desc    Get details of specific offer
// @route   GET /api/offers/:id
// @access  Private
const getOfferById = asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id).populate('businessId', 'name email');
    if (offer) {
        res.json(offer);
    } else {
        res.status(404);
        throw new Error('Offer not found');
    }
});

// @desc    Create a new offer
// @route   POST /api/offers
// @access  Private (Business only)
const createOffer = asyncHandler(async (req, res) => {
    const { title, description, category, type, price, requirements, targetAudience } = req.body;

    const offer = new Offer({
        title,
        description,
        category,
        type,
        price,
        requirements,
        targetAudience,
        businessId: req.user._id,
    });

    const createdOffer = await offer.save();
    res.status(201).json(createdOffer);
});

// @desc    Get offers by current business
// @route   GET /api/offers/my
// @access  Private (Business only)
const getMyOffers = asyncHandler(async (req, res) => {
    const offers = await Offer.find({ businessId: req.user._id });
    res.json(offers);
});

export { getOffers, getOfferById, createOffer, getMyOffers };

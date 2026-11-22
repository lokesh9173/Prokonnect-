import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import Offer from '../models/Offer.js';

/**
 * Sanitizes influencer profile based on application status.
 * - Private verification documents/screenshots are NEVER exposed to businesses.
 * - Contact details (email, phone, website) are ONLY exposed if the application is accepted.
 */
const formatInfluencerForBusiness = (influencer, isAccepted) => {
    if (!influencer) return null;

    const formatted = {
        _id: influencer._id,
        name: influencer.name,
        profilePhoto: influencer.profilePhoto || '',
        niche: influencer.niche || 'General',
        followers: influencer.followers || '0',
        platform: influencer.platform || 'Instagram',
        bio: influencer.bio || '',
        instagram: influencer.instagram || '',
        linkedin: influencer.linkedin || '',
        postReach: influencer.postReach || '',
        engagementRate: influencer.engagementRate || '',
        skills: influencer.skills || [],
        city: influencer.city || '',
        country: influencer.country || '',
    };

    // PRIVACY ENFORCEMENT: Contact details unlocked ONLY when accepted
    if (isAccepted) {
        formatted.email = influencer.email || '';
        formatted.phone = influencer.phone || '';
        formatted.website = influencer.website || '';
    }

    return formatted;
};

/**
 * Sanitizes business profile based on application status.
 * Business direct contact details (email, phone, website) are ONLY exposed to influencers if the application is accepted.
 */
const formatBusinessForInfluencer = (business, isAccepted) => {
    if (!business) return null;

    const formatted = {
        _id: business._id,
        name: business.name,
        location: business.location || '',
        profilePhoto: business.profilePhoto || '',
    };

    // PRIVACY ENFORCEMENT: Contact details unlocked ONLY when accepted
    if (isAccepted) {
        formatted.email = business.email || '';
        formatted.phone = business.phone || '';
        formatted.website = business.website || '';
    }

    return formatted;
};

// @desc    Apply to a campaign offer
// @route   POST /api/offers/:id/apply
// @access  Private (Influencer only)
const applyToOffer = asyncHandler(async (req, res) => {
    const { id: offerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
        res.status(400);
        throw new Error('Invalid offer ID format');
    }

    if (req.user.role !== 'influencer') {
        res.status(403);
        throw new Error('Access denied: Only influencer accounts can apply for campaigns');
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
        res.status(404);
        throw new Error('Campaign offer not found');
    }

    if (offer.status !== 'active') {
        res.status(400);
        throw new Error('Cannot apply to an inactive or closed campaign');
    }

    // Business cannot apply to its own campaign
    if (offer.businessId.toString() === req.user._id.toString()) {
        res.status(400);
        throw new Error('You cannot apply to your own campaign offer');
    }

    // Proactive check for duplicate application
    const existingApplication = await Application.findOne({
        offerId: offer._id,
        influencerId: req.user._id
    });

    if (existingApplication) {
        res.status(400);
        throw new Error('You have already submitted an application for this campaign');
    }

    const pitchMessage = (req.body.pitchMessage || req.body.message || '').trim();

    try {
        const application = await Application.create({
            offerId: offer._id,
            influencerId: req.user._id,
            businessId: offer.businessId,
            pitchMessage,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application: {
                _id: application._id,
                offerId: application.offerId,
                influencerId: application.influencerId,
                businessId: application.businessId,
                status: application.status,
                pitchMessage: application.pitchMessage,
                createdAt: application.createdAt
            }
        });
    } catch (err) {
        // Handle MongoDB E11000 duplicate key error gracefully
        if (err.code === 11000) {
            res.status(400);
            throw new Error('You have already submitted an application for this campaign');
        }
        throw err;
    }
});

// @desc    Get applicants for a specific offer
// @route   GET /api/offers/:id/applications
// @access  Private (Business only, must own the offer)
const getOfferApplications = asyncHandler(async (req, res) => {
    const { id: offerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
        res.status(400);
        throw new Error('Invalid offer ID format');
    }

    const offer = await Offer.findById(offerId);
    if (!offer) {
        res.status(404);
        throw new Error('Campaign offer not found');
    }

    // Ownership check: only the campaign owner business can see applicants
    if (offer.businessId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized: You can only view applicants for campaigns you own');
    }

    const rawApplications = await Application.find({ offerId: offer._id })
        .populate('influencerId', 'name email phone website profilePhoto niche followers platform bio instagram linkedin postReach engagementRate skills city country')
        .sort({ createdAt: -1 });

    // PRIVACY FILTER: Sanitize influencer contact details based on status
    const sanitizedApplications = rawApplications.map(app => {
        const isAccepted = app.status === 'accepted';
        return {
            _id: app._id,
            offerId: app.offerId,
            status: app.status,
            pitchMessage: app.pitchMessage,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            influencer: formatInfluencerForBusiness(app.influencerId, isAccepted)
        };
    });

    res.json({
        success: true,
        count: sanitizedApplications.length,
        applications: sanitizedApplications
    });
});

// @desc    Update application status (Accept / Reject)
// @route   PATCH /api/applications/:id/status
// @access  Private (Business only, must own the campaign)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id: applicationId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        res.status(400);
        throw new Error('Invalid application ID format');
    }

    if (!status || !['accepted', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error("Invalid status: Allowed values are 'accepted' or 'rejected'");
    }

    const application = await Application.findById(applicationId);
    if (!application) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Ownership check: only the business that owns this campaign can accept or reject
    if (application.businessId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized: You can only update applications for your own campaigns');
    }

    // Validate state transition: only pending applications can be accepted or rejected
    if (application.status !== 'pending') {
        res.status(400);
        throw new Error(`Application has already been marked as '${application.status}' and cannot be changed`);
    }

    application.status = status;
    const updatedApplication = await application.save();

    await updatedApplication.populate('influencerId', 'name email phone website profilePhoto niche followers platform instagram linkedin skills city country');
    await updatedApplication.populate('offerId', 'title category type price');

    const isAccepted = status === 'accepted';

    res.json({
        success: true,
        message: `Application marked as ${status}`,
        application: {
            _id: updatedApplication._id,
            offerId: updatedApplication.offerId,
            status: updatedApplication.status,
            pitchMessage: updatedApplication.pitchMessage,
            updatedAt: updatedApplication.updatedAt,
            influencer: formatInfluencerForBusiness(updatedApplication.influencerId, isAccepted)
        }
    });
});

// @desc    Get all applications submitted by the current influencer
// @route   GET /api/applications/my
// @access  Private (Influencer only)
const getMyApplications = asyncHandler(async (req, res) => {
    if (req.user.role !== 'influencer') {
        res.status(403);
        throw new Error('Access denied: Only influencer accounts have submitted applications');
    }

    const rawApplications = await Application.find({ influencerId: req.user._id })
        .populate({
            path: 'offerId',
            select: 'title category type price requirements targetAudience status description businessId',
            populate: {
                path: 'businessId',
                select: 'name email phone website location profilePhoto'
            }
        })
        .sort({ createdAt: -1 });

    // PRIVACY FILTER: Sanitize business contact details based on status
    const sanitizedApplications = rawApplications.map(app => {
        const isAccepted = app.status === 'accepted';
        const offer = app.offerId;
        
        let offerData = null;
        if (offer) {
            offerData = {
                _id: offer._id,
                title: offer.title,
                category: offer.category,
                type: offer.type,
                price: offer.price,
                requirements: offer.requirements,
                targetAudience: offer.targetAudience,
                status: offer.status,
                description: offer.description,
                business: formatBusinessForInfluencer(offer.businessId, isAccepted)
            };
        }

        return {
            _id: app._id,
            status: app.status,
            pitchMessage: app.pitchMessage,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt,
            offer: offerData
        };
    });

    res.json({
        success: true,
        count: sanitizedApplications.length,
        applications: sanitizedApplications
    });
});

export {
    applyToOffer,
    getOfferApplications,
    updateApplicationStatus,
    getMyApplications
};

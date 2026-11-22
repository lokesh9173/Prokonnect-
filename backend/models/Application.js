import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: [true, 'Offer ID is required'],
    },
    influencerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Influencer ID is required'],
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Business ID is required'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid application status'
        },
        default: 'pending',
    },
    pitchMessage: {
        type: String,
        default: '',
        trim: true,
        maxlength: [1000, 'Pitch message cannot exceed 1000 characters']
    },
}, {
    timestamps: true,
});

// Compound unique index: Prevent duplicate applications by same influencer to same offer
applicationSchema.index({ offerId: 1, influencerId: 1 }, { unique: true });

// Query optimization indexes
applicationSchema.index({ businessId: 1, status: 1 });
applicationSchema.index({ influencerId: 1, createdAt: -1 });
applicationSchema.index({ offerId: 1, createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;

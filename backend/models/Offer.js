import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['hotel', 'cafe', 'brand', 'other'],
    },
    type: {
        type: String,
        required: true,
        enum: ['barter', 'paid'],
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active',
    },
    price: {
        type: Number,
        default: 0,
    },
    requirements: {
        type: String,
    },
    targetAudience: {
        type: String,
        enum: ['students', 'influencers', 'everyone'],
        default: 'everyone'
    },
}, {
    timestamps: true,
});

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;

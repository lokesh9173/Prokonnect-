import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'influencer', 'business'],
        default: 'influencer',
    },
    // Additional profile fields can be added here
    profilePhoto: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    niche: {
        type: String,
        default: 'General',
    },
    followers: {
        type: String,
        default: '0',
    },
    platform: {
        type: String,
        default: 'Instagram',
    },
    title: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    website: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    instagram: {
        type: String,
        default: '',
    },
    linkedin: {
        type: String,
        default: '',
    },
    postReach: {
        type: String,
        default: '',
    },
    storyViews: {
        type: String,
        default: '',
    },
    engagementRate: {
        type: String,
        default: '',
    },
    profileVisits: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    ageGroup: {
        type: String,
        default: '',
    },
    verificationScreenshots: {
        type: [String],
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    verified: {
        type: Boolean,
        default: false,
    },
    theme: {
        type: String,
        default: 'light',
    },
    language: {
        type: String,
        default: 'en',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

export default User;

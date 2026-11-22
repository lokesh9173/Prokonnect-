import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users (with optional role filter)
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
    const { role } = req.query;
    let query = {};

    if (role) {
        query.role = role;
    }

    const users = await User.find(query).select('-password');
    res.json(users);
});

// @desc    Get user profile (current logged in user)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Secure password update if password is provided
        const newPassword = req.body.newPassword || req.body.password;
        if (newPassword && newPassword.trim().length > 0) {
            const currentPassword = req.body.currentPassword;
            if (!currentPassword) {
                res.status(400);
                throw new Error('Current password is required to change password');
            }

            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                res.status(401);
                throw new Error('Incorrect current password');
            }

            if (newPassword.length < 6) {
                res.status(400);
                throw new Error('New password must be at least 6 characters long');
            }

            user.password = newPassword;
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
        user.profilePhoto = req.body.profilePhoto !== undefined ? req.body.profilePhoto : user.profilePhoto;
        user.title = req.body.title !== undefined ? req.body.title : user.title;
        user.location = req.body.location !== undefined ? req.body.location : user.location;
        user.website = req.body.website !== undefined ? req.body.website : user.website;
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.instagram = req.body.instagram !== undefined ? req.body.instagram : user.instagram;
        user.linkedin = req.body.linkedin !== undefined ? req.body.linkedin : user.linkedin;
        user.niche = req.body.niche !== undefined ? req.body.niche : user.niche;
        user.followers = req.body.followers !== undefined ? req.body.followers : user.followers;
        user.postReach = req.body.postReach !== undefined ? req.body.postReach : user.postReach;
        user.storyViews = req.body.storyViews !== undefined ? req.body.storyViews : user.storyViews;
        user.engagementRate = req.body.engagementRate !== undefined ? req.body.engagementRate : user.engagementRate;
        user.profileVisits = req.body.profileVisits !== undefined ? req.body.profileVisits : user.profileVisits;
        user.country = req.body.country !== undefined ? req.body.country : user.country;
        user.city = req.body.city !== undefined ? req.body.city : user.city;
        user.ageGroup = req.body.ageGroup !== undefined ? req.body.ageGroup : user.ageGroup;
        user.verificationScreenshots = req.body.verificationScreenshots !== undefined ? req.body.verificationScreenshots : user.verificationScreenshots;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            bio: updatedUser.bio,
            skills: updatedUser.skills,
            profilePhoto: updatedUser.profilePhoto,
            title: updatedUser.title,
            location: updatedUser.location,
            website: updatedUser.website,
            phone: updatedUser.phone,
            instagram: updatedUser.instagram,
            linkedin: updatedUser.linkedin,
            niche: updatedUser.niche,
            followers: updatedUser.followers,
            postReach: updatedUser.postReach,
            storyViews: updatedUser.storyViews,
            engagementRate: updatedUser.engagementRate,
            profileVisits: updatedUser.profileVisits,
            country: updatedUser.country,
            city: updatedUser.city,
            ageGroup: updatedUser.ageGroup,
            verificationScreenshots: updatedUser.verificationScreenshots,
            theme: updatedUser.theme,
            language: updatedUser.language
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
const getUserSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('theme language');
    if (user) {
        res.json({
            theme: user.theme,
            language: user.language
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
const updateUserSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.theme = req.body.theme || user.theme;
        user.language = req.body.language || user.language;

        const updatedUser = await user.save();

        res.json({
            theme: updatedUser.theme,
            language: updatedUser.language
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password -verificationScreenshots -resetPasswordToken -resetPasswordExpire');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // If requesting user is viewing their own profile, return full profile data
    if (req.user && req.user._id.toString() === user._id.toString()) {
        return res.json(user);
    }

    // Role-specific privacy filtering
    if (user.role === 'business') {
        return res.json({
            _id: user._id,
            name: user.name,
            profilePhoto: user.profilePhoto || '',
            bio: user.bio || '',
            location: user.location || '',
            website: user.website || '',
            title: user.title || '',
            niche: user.niche || 'Business',
            role: user.role,
            createdAt: user.createdAt
        });
    }

    if (user.role === 'influencer') {
        return res.json({
            _id: user._id,
            name: user.name,
            profilePhoto: user.profilePhoto || '',
            bio: user.bio || '',
            location: user.location || '',
            niche: user.niche || 'General',
            followers: user.followers || '0',
            platform: user.platform || 'Instagram',
            instagram: user.instagram || '',
            linkedin: user.linkedin || '',
            postReach: user.postReach || '',
            engagementRate: user.engagementRate || '',
            skills: user.skills || [],
            city: user.city || '',
            country: user.country || '',
            role: user.role,
            createdAt: user.createdAt
        });
    }

    res.json(user);
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Both currentPassword and newPassword are required');
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters long');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        res.status(401);
        throw new Error('Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    res.json({
        success: true,
        message: 'Password updated successfully'
    });
});

export { getUsers, getUserProfile, updateUserProfile, getUserSettings, updateUserSettings, getUserById, changePassword };

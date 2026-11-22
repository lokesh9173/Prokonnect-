import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Strict Authorization header check: Tokens must NEVER be passed in URL query parameters
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            return next();
        } catch (error) {
            console.error('Authentication Error:', error.message);
            res.status(401);
            throw new Error(error.message || 'Not authorized, token failed');
        }
    }

    res.status(401);
    throw new Error('Not authorized, no Bearer token provided in Authorization header');
});

/**
 * Role-based authorization middleware
 * @param  {...string} roles - e.g. 'business', 'influencer'
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized, user session missing');
        }

        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`Access denied: Requires '${roles.join(' or ')}' role`);
        }

        next();
    };
};

export { protect, requireRole };

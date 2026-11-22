import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

// =========================================================================
// 1. JWT SECRET VALIDATION (FAIL FAST IN PRODUCTION)
// =========================================================================
const isProduction = process.env.NODE_ENV === 'production';
const jwtSecret = process.env.JWT_SECRET;
const knownWeakSecrets = [
    'supersecret123',
    'secret',
    'jwtsecret',
    'your_super_secret_jwt_key_here_min_32_chars',
    '12345678',
    'changeme'
];

if (!jwtSecret || jwtSecret.trim().length === 0) {
    if (isProduction) {
        console.error('FATAL CONFIGURATION ERROR: JWT_SECRET environment variable is missing in production!');
        console.error('The application cannot start without a cryptographically secure JWT_SECRET.');
        console.error('Generate a key using: openssl rand -hex 32');
        process.exit(1);
    } else {
        console.warn('⚠️  SECURITY WARNING: JWT_SECRET is not set in development. Using development fallback.');
        process.env.JWT_SECRET = 'dev_fallback_jwt_secret_do_not_use_in_prod_32c';
    }
} else if (isProduction && (jwtSecret.length < 32 || knownWeakSecrets.includes(jwtSecret.toLowerCase()))) {
    console.error('FATAL CONFIGURATION ERROR: JWT_SECRET is too weak for production (minimum 32 characters required, default secrets forbidden)!');
    console.error('Generate a key using: openssl rand -hex 32');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Express trust proxy for single Nginx reverse proxy in production
// Enables correct client IP detection for rate-limiting and access logging
if (isProduction) {
    app.set('trust proxy', 1);
}

// Core Security & Request Parsing Middleware
app.use(helmet()); // Secure HTTP headers
app.use(express.json({ limit: '10kb' })); // Body parser limit to 10kb to prevent DOS
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection

// Global rate limiting
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// =========================================================================
// 2. PRODUCTION CORS CONFIGURATION
// =========================================================================
const configuredClientUrls = (process.env.CLIENT_URL || '')
    .split(',')
    .map(url => url.trim().replace(/\/$/, ''))
    .filter(Boolean);

const developmentOrigins = [
    'http://localhost:5174',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5173',
];

// In production, strictly restrict to configured client URLs.
// Localhost origins are permitted ONLY in non-production development environments.
const allowedOrigins = isProduction
    ? configuredClientUrls
    : [...configuredClientUrls, ...developmentOrigins];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like same-origin, curl, server-to-server, health check)
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy does not allow access from origin: ${origin}`));
        }
    },
    credentials: true,
}));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        database: states[dbState] || 'unknown',
        memoryUsage: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
const uploadsDir = path.join(__dirname, 'uploads');
const privateUploadsDir = path.join(__dirname, 'private_uploads/verification');

// Ensure upload directories exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(privateUploadsDir)) {
    fs.mkdirSync(privateUploadsDir, { recursive: true });
}

// =========================================================================
// 3. PRIVATE VERIFICATION FILE ACCESS PROTECTION
// =========================================================================
// Block direct static web access to any verification files under /uploads
app.use('/uploads', (req, res, next) => {
    const basename = path.basename(req.path).toLowerCase();
    if (basename.startsWith('verification-') || basename.includes('verification')) {
        return res.status(403).json({
            success: false,
            message: 'Direct static access to private verification files is forbidden. Use the authenticated endpoint.'
        });
    }
    next();
});

// Serve public uploads (avatars only)
app.use('/uploads', express.static(uploadsDir));

// Serve Frontend in Production if built
if (isProduction) {
    const frontendDist = path.join(projectRoot, 'frontend/dist');
    if (fs.existsSync(frontendDist)) {
        app.use(express.static(frontendDist));

        app.get('*', (req, res, next) => {
            if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
                return next();
            }
            res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
                if (err) next();
            });
        });
    } else {
        app.get('/', (req, res) => {
            res.send('ProKonnect API is running in production mode...');
        });
    }
} else {
    app.get('/', (req, res) => {
        res.send('ProKonnect API is running...');
    });
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful Shutdown
const handleShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            await mongoose.connection.close(false);
            console.log('MongoDB connection closed.');
            process.exit(0);
        } catch (err) {
            console.error('Error during database disconnection:', err);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

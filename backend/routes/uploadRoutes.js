import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicUploadDir = path.join(__dirname, '../uploads');
const privateUploadDir = path.join(__dirname, '../private_uploads/verification');

// Ensure directories exist
if (!fs.existsSync(publicUploadDir)) {
    fs.mkdirSync(publicUploadDir, { recursive: true });
}
if (!fs.existsSync(privateUploadDir)) {
    fs.mkdirSync(privateUploadDir, { recursive: true });
}

// Migration helper: Move legacy verification files out of public directory without deleting user records
const migrateLegacyVerificationFiles = () => {
    try {
        if (!fs.existsSync(publicUploadDir)) return;
        const files = fs.readdirSync(publicUploadDir);
        for (const file of files) {
            if (file.toLowerCase().startsWith('verification-') || file.toLowerCase().includes('verification')) {
                const oldPath = path.join(publicUploadDir, file);
                const newPath = path.join(privateUploadDir, file);
                if (fs.existsSync(oldPath)) {
                    if (!fs.existsSync(newPath)) {
                        fs.renameSync(oldPath, newPath);
                    } else {
                        // File already safely present in private directory; remove redundant public copy
                        fs.unlinkSync(oldPath);
                    }
                }
            }
        }
    } catch (e) {
        // Silently skip if cannot access
    }
};
migrateLegacyVerificationFiles();

// Storage configuration for Public Avatars
const publicStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, publicUploadDir);
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
    }
});

// Storage configuration for Private Verification Documents
const privateStorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, privateUploadDir);
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `verification-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`);
    }
});

// File type validators
const imageFileTypes = /jpg|jpeg|png|webp/;
const docFileTypes = /jpg|jpeg|png|webp|pdf/;

function validateFile(file, allowedTypes, cb) {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype.toLowerCase()) || 
                     (file.mimetype === 'application/pdf' && allowedTypes.test('pdf'));

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Supported formats: ${allowedTypes.source.replace(/\|/g, ', ').toUpperCase()}`));
    }
}

// Multer upload instances with 5MB limit
const imageUpload = multer({
    storage: publicStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter(req, file, cb) {
        validateFile(file, imageFileTypes, cb);
    }
});

const verificationUpload = multer({
    storage: privateStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter(req, file, cb) {
        validateFile(file, docFileTypes, cb);
    }
});

// Inspect actual binary signature (magic bytes) to prevent content spoofing
function verifyFileContent(filePath, category) {
    if (!fs.existsSync(filePath)) return false;
    const buffer = Buffer.alloc(12);
    let fd = null;
    try {
        fd = fs.openSync(filePath, 'r');
        fs.readSync(fd, buffer, 0, 12, 0);
    } catch (e) {
        return false;
    } finally {
        if (fd !== null) {
            try { fs.closeSync(fd); } catch (e) {}
        }
    }

    // JPEG: FF D8 FF
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
    // PNG: 89 50 4E 47
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
    // WEBP: RIFF....WEBP
    const isWebp = buffer.toString('utf8', 0, 4) === 'RIFF' && buffer.toString('utf8', 8, 12) === 'WEBP';
    // PDF: %PDF
    const isPdf = buffer.toString('utf8', 0, 4) === '%PDF';

    if (category === 'image') {
        return isJpeg || isPng || isWebp;
    }
    return isJpeg || isPng || isWebp || isPdf;
}

// Multer error handling wrapper with content signature check and cleanup on failure
const uploadWrapper = (uploader, category = 'any') => (req, res, next) => {
    uploader(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                try { fs.unlinkSync(req.file.path); } catch (e) {}
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.status(400);
                return next(new Error('File too large: Maximum allowed size is 5MB'));
            }
            res.status(400);
            return next(new Error(`Upload error: ${err.message}`));
        } else if (err) {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                try { fs.unlinkSync(req.file.path); } catch (e) {}
            }
            res.status(400);
            return next(err);
        }

        // Verify actual binary content of uploaded file
        if (req.file && req.file.path) {
            const validSignature = verifyFileContent(req.file.path, category);
            if (!validSignature) {
                if (fs.existsSync(req.file.path)) {
                    try { fs.unlinkSync(req.file.path); } catch (e) {}
                }
                res.status(400);
                return next(new Error('Invalid or corrupted file content: File header signature does not match allowed format'));
            }
        }

        next();
    });
};

// @desc    Upload avatar photo (publicly accessible via /uploads)
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, uploadWrapper(imageUpload.single('image'), 'image'), async (req, res, next) => {
    if (!req.file) {
        res.status(400);
        return next(new Error('No image file provided'));
    }

    try {
        const filePath = `/uploads/${req.file.filename}`;
        
        const user = await User.findById(req.user._id);
        if (user) {
            user.profilePhoto = filePath;
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Profile photo updated successfully',
            image: filePath,
        });
    } catch (err) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        res.status(500);
        next(new Error('Failed to update profile photo'));
    }
});

// @desc    Upload verification document (stored in private directory, not statically exposed)
// @route   POST /api/upload/verification
// @access  Private
router.post('/verification', protect, uploadWrapper(verificationUpload.single('image')), async (req, res, next) => {
    if (!req.file) {
        res.status(400);
        return next(new Error('No verification file provided'));
    }

    try {
        const fileRef = `/api/upload/verification/${req.file.filename}`;

        const user = await User.findById(req.user._id);
        if (user) {
            if (!Array.isArray(user.verificationScreenshots)) {
                user.verificationScreenshots = [];
            }
            user.verificationScreenshots.push(fileRef);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Verification document uploaded successfully',
            image: fileRef,
        });
    } catch (err) {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }
        res.status(500);
        next(new Error('Failed to upload verification document'));
    }
});

// @desc    Secure, authenticated access to private verification documents
// @route   GET /api/upload/verification/:filename
// @access  Private (Owner only; admin when admin role is implemented)
router.get('/verification/:filename', protect, async (req, res) => {
    const rawFilename = req.params.filename;
    if (!rawFilename) {
        return res.status(400).json({ success: false, message: 'Filename is required' });
    }

    // Path traversal prevention: reject any directory traversal attempts or invalid characters
    const safeFilename = path.basename(rawFilename);
    if (
        rawFilename !== safeFilename ||
        !safeFilename ||
        safeFilename === '.' ||
        safeFilename === '..' ||
        safeFilename.includes('..') ||
        !/^[a-zA-Z0-9._-]+$/.test(safeFilename)
    ) {
        return res.status(400).json({ success: false, message: 'Invalid filename' });
    }

    try {
        // Authenticated owner authorization check
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const userScreenshots = Array.isArray(user.verificationScreenshots) ? user.verificationScreenshots : [];
        const isOwner = userScreenshots.some(item => {
            if (!item) return false;
            return item.includes(safeFilename);
        });

        // Note: Admin role does not exist in User schema enum ['student', 'influencer', 'business'].
        // Access is strictly restricted to the verified document owner.
        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Access denied: You can only view your own verification documents'
            });
        }

        // Check private upload directory first
        let targetPath = path.join(privateUploadDir, safeFilename);
        if (!fs.existsSync(targetPath)) {
            // Check legacy upload directory fallback
            targetPath = path.join(publicUploadDir, safeFilename);
            if (!fs.existsSync(targetPath)) {
                return res.status(404).json({ success: false, message: 'Verification document not found' });
            }
        }

        res.setHeader('Cache-Control', 'private, no-store, max-age=0');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.sendFile(targetPath);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error retrieving verification document' });
    }
});

// @desc    General upload (supports ?type=avatar or ?type=verification)
// @route   POST /api/upload
// @access  Private
router.post('/', protect, async (req, res, next) => {
    const uploadType = (req.query.type || req.body.type || '').toLowerCase();

    if (uploadType === 'avatar') {
        uploadWrapper(imageUpload.single('image'), 'image')(req, res, async (err) => {
            if (err) return next(err);
            if (!req.file) {
                res.status(400);
                return next(new Error('No file provided'));
            }
            try {
                const filePath = `/uploads/${req.file.filename}`;
                const user = await User.findById(req.user._id);
                if (user) {
                    user.profilePhoto = filePath;
                    await user.save();
                }
                res.status(200).json({
                    success: true,
                    message: 'Profile photo updated successfully',
                    image: filePath,
                    type: 'avatar'
                });
            } catch (e) {
                res.status(500);
                next(new Error('Avatar upload failed'));
            }
        });
    } else {
        uploadWrapper(verificationUpload.single('image'))(req, res, async (err) => {
            if (err) return next(err);
            if (!req.file) {
                res.status(400);
                return next(new Error('No file provided'));
            }
            try {
                const fileRef = `/api/upload/verification/${req.file.filename}`;
                const user = await User.findById(req.user._id);
                if (user) {
                    if (!Array.isArray(user.verificationScreenshots)) {
                        user.verificationScreenshots = [];
                    }
                    user.verificationScreenshots.push(fileRef);
                    await user.save();
                }
                res.status(200).json({
                    success: true,
                    message: 'Verification document uploaded successfully',
                    image: fileRef,
                    type: 'verification'
                });
            } catch (e) {
                res.status(500);
                next(new Error('Verification upload failed'));
            }
        });
    }
});

export default router;

import { INITIAL_DEMO_DATA } from './demoData.js';

const DEMO_STORE_KEY = 'prokonnect_demo_store_v1';
const DEMO_SALT = 'prokonnect_demo_salt_2026_';

/**
 * Simple, deterministic non-plaintext password hashing for demo storage.
 * Never stores plaintext passwords in localStorage.
 */
export function hashDemoPassword(password) {
    if (!password) return '';
    let hash = 0;
    const combined = `${DEMO_SALT}${password}`;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `phash_${Math.abs(hash).toString(16)}demo`;
}

/**
 * Retrieves the current demo store from localStorage.
 * If not yet initialized or corrupted, seeds with INITIAL_DEMO_DATA.
 */
export function getDemoStore() {
    try {
        const raw = localStorage.getItem(DEMO_STORE_KEY);
        if (!raw) {
            const initialClone = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
            localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(initialClone));
            return initialClone;
        }
        return JSON.parse(raw);
    } catch (err) {
        console.error('Error reading demo store, reseeding:', err);
        const initialClone = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
        localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(initialClone));
        return initialClone;
    }
}

/**
 * Persists the demo store to localStorage.
 */
export function saveDemoStore(store) {
    try {
        localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(store));
    } catch (err) {
        console.error('Failed to save demo store to localStorage:', err);
    }
}

/**
 * Resets the demo store to the initial realistic seed data.
 */
export function resetDemoStore() {
    const initialClone = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(initialClone));
    return initialClone;
}

// ==========================================
// Authentication & User Management
// ==========================================

export function demoAuthenticate(email, password) {
    const store = getDemoStore();
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = store.users.find(u => (u.email || '').toLowerCase() === cleanEmail);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const inputHash = hashDemoPassword(password);
    // In demo mode, accept pre-seeded hash, matching hashed input, or standard 'demo123' / 'password123'
    const isPasswordValid = 
        user.passwordHash === inputHash || 
        user.passwordHash === 'phash_54321demo' ||
        password === 'demo123' ||
        password === 'password123' ||
        password === 'demo';

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto || '',
        token: `demo-jwt-token-${user._id}-${Date.now()}`
    };
}

export function demoRegister({ name, email, password, role = 'influencer' }) {
    const store = getDemoStore();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!name || !email || !password) {
        throw new Error('Please fill in all required fields');
    }

    const existing = store.users.find(u => (u.email || '').toLowerCase() === cleanEmail);
    if (existing) {
        throw new Error('A user with this email already exists');
    }

    const newUserId = `demo-user-${Date.now()}`;
    const newUser = {
        _id: newUserId,
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashDemoPassword(password),
        role: role || 'influencer',
        isDemo: true,
        title: role === 'business' ? 'Brand Partner' : 'Content Creator',
        niche: 'General',
        location: 'Demo City',
        website: '',
        phone: '',
        bio: 'New ProKonnect member enjoying demo mode!',
        profilePhoto: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop`,
        skills: ['Social Media', 'Content Creation'],
        verificationScreenshots: [],
        createdAt: new Date().toISOString()
    };

    if (role === 'influencer') {
        newUser.followers = '50K';
        newUser.postReach = '15K';
        newUser.storyViews = '5K';
        newUser.engagementRate = '4.5%';
        newUser.profileVisits = '25K';
        newUser.country = 'United States';
        newUser.city = 'Demo City';
        newUser.ageGroup = '20-30';
    }

    store.users.unshift(newUser);
    saveDemoStore(store);

    return {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePhoto: newUser.profilePhoto,
        token: `demo-jwt-token-${newUser._id}-${Date.now()}`
    };
}

export function demoGetUserById(id) {
    const store = getDemoStore();
    const user = store.users.find(u => u._id === id || u.id === id);
    if (!user) {
        throw new Error('User not found');
    }
    // Return sanitized user object
    const { passwordHash: _hash, ...safeUser } = user;
    return safeUser;
}

export function demoGetUserProfile(userId) {
    return demoGetUserById(userId);
}

export function demoUpdateUserProfile(userId, updates) {
    const store = getDemoStore();
    const userIndex = store.users.findIndex(u => u._id === userId);
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    // Merge allowed updates
    const current = store.users[userIndex];
    const allowedFields = [
        'name', 'title', 'niche', 'location', 'website', 'phone',
        'bio', 'profilePhoto', 'skills', 'followers', 'postReach',
        'storyViews', 'engagementRate', 'profileVisits', 'country',
        'city', 'ageGroup', 'role'
    ];

    allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
            current[field] = updates[field];
        }
    });

    if (Array.isArray(updates.skills)) {
        current.skills = updates.skills;
    }

    if (updates.newPassword) {
        current.passwordHash = hashDemoPassword(updates.newPassword);
    }

    store.users[userIndex] = current;
    saveDemoStore(store);

    const { passwordHash: _hash, ...safeUser } = current;
    return {
        ...safeUser,
        token: `demo-jwt-token-${current._id}-${Date.now()}`
    };
}

export function demoGetUsers(query = {}) {
    const store = getDemoStore();
    let users = [...store.users];

    if (query.role) {
        users = users.filter(u => u.role === query.role);
    }
    if (query.search) {
        const s = query.search.toLowerCase();
        users = users.filter(u => 
            (u.name || '').toLowerCase().includes(s) || 
            (u.niche || '').toLowerCase().includes(s) ||
            (u.location || '').toLowerCase().includes(s)
        );
    }

    return users.map(u => {
        const { passwordHash: _hash, ...safe } = u;
        return safe;
    });
}

// ==========================================
// Offers / Campaigns Management
// ==========================================

export function demoGetOffers(filters = {}) {
    const store = getDemoStore();
    let offers = store.offers.filter(o => o.status === 'active' || o.active !== false);

    if (filters.category && filters.category !== 'all') {
        offers = offers.filter(o => (o.category || '').toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.type && filters.type !== 'all') {
        offers = offers.filter(o => (o.type || '').toLowerCase() === filters.type.toLowerCase());
    }
    if (filters.search) {
        const s = filters.search.toLowerCase();
        offers = offers.filter(o => 
            (o.title || '').toLowerCase().includes(s) || 
            (o.description || '').toLowerCase().includes(s)
        );
    }

    // Populate businessId: { _id, name, email, profilePhoto }
    return offers.map(o => {
        const biz = store.users.find(u => u._id === o.businessId);
        return {
            ...o,
            businessId: biz ? {
                _id: biz._id,
                name: biz.name,
                email: biz.email,
                profilePhoto: biz.profilePhoto || ''
            } : { _id: o.businessId, name: 'Demo Partner', email: 'partner@prokonnect.demo' }
        };
    });
}

export function demoGetMyOffers(businessId) {
    const store = getDemoStore();
    return store.offers.filter(o => o.businessId === businessId);
}

export function demoGetOfferById(offerId) {
    const store = getDemoStore();
    const offer = store.offers.find(o => o._id === offerId);
    if (!offer) {
        throw new Error('Offer not found');
    }
    const biz = store.users.find(u => u._id === offer.businessId);
    return {
        ...offer,
        businessId: biz ? {
            _id: biz._id,
            name: biz.name,
            email: biz.email,
            profilePhoto: biz.profilePhoto || ''
        } : { _id: offer.businessId, name: 'Demo Partner', email: 'partner@prokonnect.demo' }
    };
}

export function demoCreateOffer(businessId, offerData) {
    const store = getDemoStore();
    const newOffer = {
        _id: `demo-offer-${Date.now()}`,
        title: offerData.title || 'New Collaboration Campaign',
        description: offerData.description || '',
        category: (offerData.category || 'other').toLowerCase(),
        type: offerData.type || 'barter',
        targetAudience: offerData.targetAudience || 'everyone',
        price: Number(offerData.price) || 0,
        requirements: Array.isArray(offerData.requirements) ? offerData.requirements : [],
        businessId: businessId,
        active: true,
        status: 'active',
        analytics: { views: 0, clicks: 0 },
        createdAt: new Date().toISOString()
    };

    store.offers.unshift(newOffer);
    saveDemoStore(store);
    return newOffer;
}

export function demoUpdateOffer(offerId, offerData, businessId) {
    const store = getDemoStore();
    const index = store.offers.findIndex(o => o._id === offerId);
    if (index === -1) {
        throw new Error('Offer not found');
    }

    const current = store.offers[index];
    if (businessId && current.businessId !== businessId) {
        throw new Error('Not authorized to update this offer');
    }

    const updated = {
        ...current,
        title: offerData.title !== undefined ? offerData.title : current.title,
        description: offerData.description !== undefined ? offerData.description : current.description,
        category: offerData.category !== undefined ? offerData.category.toLowerCase() : current.category,
        type: offerData.type !== undefined ? offerData.type : current.type,
        targetAudience: offerData.targetAudience !== undefined ? offerData.targetAudience : current.targetAudience,
        price: offerData.price !== undefined ? Number(offerData.price) : current.price,
        requirements: Array.isArray(offerData.requirements) ? offerData.requirements : current.requirements,
        status: offerData.status !== undefined ? offerData.status : current.status,
        active: offerData.active !== undefined ? offerData.active : current.active,
    };

    store.offers[index] = updated;
    saveDemoStore(store);
    return updated;
}

export function demoDeleteOffer(offerId, businessId) {
    const store = getDemoStore();
    const index = store.offers.findIndex(o => o._id === offerId);
    if (index === -1) {
        throw new Error('Offer not found');
    }

    const current = store.offers[index];
    if (businessId && current.businessId !== businessId) {
        throw new Error('Not authorized to delete this offer');
    }

    store.offers.splice(index, 1);
    // Also remove applications associated with this offer
    store.applications = store.applications.filter(a => a.offerId !== offerId);
    saveDemoStore(store);
    return { message: 'Offer removed successfully' };
}

// ==========================================
// Applications & Collaboration Workflow
// ==========================================

export function demoApplyToOffer(influencerId, offerId, pitchMessage) {
    const store = getDemoStore();
    const offer = store.offers.find(o => o._id === offerId);
    if (!offer) {
        throw new Error('Offer not found');
    }

    // STRICT CHECK: Duplicate application prevention
    const existing = store.applications.find(
        a => a.offerId === offerId && a.influencerId === influencerId
    );
    if (existing) {
        throw new Error('You have already applied to this offer');
    }

    const newApp = {
        _id: `demo-app-${Date.now()}`,
        offerId: offerId,
        influencerId: influencerId,
        businessId: offer.businessId,
        status: 'pending',
        pitchMessage: pitchMessage || 'Excited to collaborate on this campaign!',
        createdAt: new Date().toISOString()
    };

    store.applications.unshift(newApp);
    saveDemoStore(store);

    return newApp;
}

/**
 * Returns applications for a given offer (Business view).
 * Sanitizes influencer profile according to Phase 2 privacy rules:
 * - Contact info (email, phone, website) is ONLY revealed if application is 'accepted'.
 * - Verification documents are NEVER exposed to the business.
 */
export function demoGetOfferApplications(offerId, _businessId) {
    const store = getDemoStore();
    const offer = store.offers.find(o => o._id === offerId);
    if (!offer) {
        throw new Error('Offer not found');
    }

    const apps = store.applications.filter(a => a.offerId === offerId);

    return apps.map(app => {
        const inf = store.users.find(u => u._id === app.influencerId);
        const isAccepted = app.status === 'accepted';

        const sanitizedInf = inf ? {
            _id: inf._id,
            name: inf.name,
            profilePhoto: inf.profilePhoto || '',
            niche: inf.niche || 'General',
            followers: inf.followers || '0',
            postReach: inf.postReach || '',
            engagementRate: inf.engagementRate || '',
            bio: inf.bio || '',
            skills: inf.skills || [],
            city: inf.city || '',
            country: inf.country || '',
            ...(isAccepted ? {
                email: inf.email || '',
                phone: inf.phone || '',
                website: inf.website || ''
            } : {})
        } : null;

        return {
            ...app,
            influencer: sanitizedInf,
            influencerId: sanitizedInf
        };
    });
}

/**
 * Returns applications submitted by the given influencer.
 * Sanitizes business profile according to Phase 2 privacy rules:
 * - Direct contact info (email, phone, website) is ONLY revealed if application is 'accepted'.
 */
export function demoGetMyApplications(influencerId) {
    const store = getDemoStore();
    const apps = store.applications.filter(a => a.influencerId === influencerId);

    return apps.map(app => {
        const offer = store.offers.find(o => o._id === app.offerId);
        const biz = offer ? store.users.find(u => u._id === offer.businessId) : null;
        const isAccepted = app.status === 'accepted';

        const sanitizedBiz = biz ? {
            _id: biz._id,
            name: biz.name,
            profilePhoto: biz.profilePhoto || '',
            ...(isAccepted ? {
                email: biz.email || '',
                phone: biz.phone || '',
                website: biz.website || ''
            } : {})
        } : null;

        const populatedOffer = offer ? {
            _id: offer._id,
            title: offer.title,
            type: offer.type,
            category: offer.category,
            price: offer.price,
            businessId: sanitizedBiz
        } : null;

        return {
            ...app,
            offerId: populatedOffer
        };
    });
}

export function demoUpdateApplicationStatus(applicationId, newStatus, businessId) {
    const store = getDemoStore();
    const appIndex = store.applications.findIndex(a => a._id === applicationId);
    if (appIndex === -1) {
        throw new Error('Application not found');
    }

    if (!['accepted', 'rejected', 'pending'].includes(newStatus)) {
        throw new Error('Invalid status. Allowed values: accepted, rejected, pending');
    }

    const app = store.applications[appIndex];
    if (businessId && app.businessId !== businessId) {
        throw new Error('Not authorized to update this application');
    }

    app.status = newStatus;
    app.updatedAt = new Date().toISOString();
    store.applications[appIndex] = app;
    saveDemoStore(store);

    return app;
}

// ==========================================
// Upload Mock Helpers
// ==========================================

export function demoUploadAvatar(userId, _filename = 'avatar.png') {
    const store = getDemoStore();
    const userIndex = store.users.findIndex(u => u._id === userId || u.id === userId);
    const mockAvatarUrl = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop`;
    
    if (userIndex !== -1) {
        store.users[userIndex].profilePhoto = mockAvatarUrl;
        saveDemoStore(store);
    }
    return {
        success: true,
        message: 'Profile photo updated successfully',
        image: mockAvatarUrl,
        avatarUrl: mockAvatarUrl,
        url: mockAvatarUrl
    };
}

export function demoUploadVerification(userId, _filename = 'verification-doc.png') {
    const store = getDemoStore();
    const userIndex = store.users.findIndex(u => u._id === userId || u.id === userId);
    const mockUrl = `/api/upload/verification/verification-demo-${Date.now()}.png`;

    if (userIndex !== -1) {
        if (!store.users[userIndex].verificationScreenshots) {
            store.users[userIndex].verificationScreenshots = [];
        }
        store.users[userIndex].verificationScreenshots.push(mockUrl);
        saveDemoStore(store);
    }
    return {
        success: true,
        message: 'Verification document uploaded successfully (Demo)',
        image: mockUrl,
        url: mockUrl
    };
}

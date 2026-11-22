/**
 * Pre-seeded realistic demo data for ProKonnect.
 * Contains multiple businesses, influencers, campaigns across categories,
 * and sample applications in pending, accepted, and rejected statuses.
 * All data is isolated in browser localStorage and uses no real personal info.
 */

export const INITIAL_DEMO_DATA = {
    users: [
        // Demo Business 1 (Default Business Demo)
        {
            _id: 'demo-biz-1',
            name: 'Vogue Apparel',
            email: 'vogue@prokonnect.demo',
            passwordHash: 'phash_54321demo',
            role: 'business',
            isDemo: true,
            title: 'Luxury Streetwear & Ready-to-Wear',
            niche: 'Fashion',
            location: 'New York, USA',
            website: 'https://vogueapparel.example.com',
            phone: '+1 (555) 234-5678',
            bio: 'Pioneering sustainable luxury streetwear in collaboration with dynamic visual creators.',
            profilePhoto: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&auto=format&fit=crop',
            skills: ['Apparel', 'E-commerce', 'Brand Collabs'],
            createdAt: '2026-10-15T08:00:00.000Z'
        },
        // Demo Business 2
        {
            _id: 'demo-biz-2',
            name: 'Apex Gaming Gear',
            email: 'apex@prokonnect.demo',
            passwordHash: 'phash_54321demo',
            role: 'business',
            isDemo: true,
            title: 'High-Performance Esports Peripherals',
            niche: 'Gaming',
            location: 'Seattle, USA',
            website: 'https://apexgaming.example.com',
            phone: '+1 (555) 345-6789',
            bio: 'Engineered for esports professionals, streamers, and hardcore competitive gamers.',
            profilePhoto: 'https://images.unsplash.com/photo-1612287233211-12f5a052b614?w=150&auto=format&fit=crop',
            skills: ['Hardware', 'Live Streaming', 'Gaming Sponsorships'],
            createdAt: '2026-10-20T11:30:00.000Z'
        },
        // Demo Business 3
        {
            _id: 'demo-biz-3',
            name: 'Grand Horizon Resort',
            email: 'horizon@prokonnect.demo',
            passwordHash: 'phash_54321demo',
            role: 'business',
            isDemo: true,
            title: '5-Star Cliffside Eco Resort & Spa',
            niche: 'Travel',
            location: 'Bali, Indonesia',
            website: 'https://grandhorizon.example.com',
            phone: '+62 361 555 0192',
            bio: 'Oceanfront luxury villas partnering with premier travel, wellness, and lifestyle storytellers.',
            profilePhoto: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop',
            skills: ['Hospitality', 'Barter Stays', 'Luxury Travel'],
            createdAt: '2026-10-25T14:15:00.000Z'
        },
        // Demo Influencer 1 (Default Influencer Demo)
        {
            _id: 'demo-inf-1',
            name: 'Alex Rivera',
            email: 'alex@prokonnect.demo',
            passwordHash: 'phash_54321demo',
            role: 'influencer',
            isDemo: true,
            title: 'High-Fashion Stylist & Editorial Model',
            niche: 'Fashion',
            location: 'New York, USA',
            website: 'https://instagram.com/alexrivera.demo',
            phone: '+1 (555) 987-6543',
            followers: '1.2M',
            postReach: '340K',
            storyViews: '95K',
            engagementRate: '4.8%',
            profileVisits: '420K',
            country: 'United States',
            city: 'New York',
            ageGroup: '20-28',
            bio: 'Visual story-teller crafting high-conversion content for modern luxury brands and premium street styles.',
            profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
            skills: ['Lookbook Curation', 'Creative Direction', 'Runway', 'Instagram Reels'],
            verificationScreenshots: ['/api/upload/verification/verification-demo-alex-proof.png'],
            createdAt: '2026-10-18T09:00:00.000Z'
        },
        // Demo Influencer 2
        {
            _id: 'demo-inf-2',
            name: 'Sarah Chen',
            email: 'sarah@prokonnect.demo',
            passwordHash: 'phash_54321demo',
            role: 'influencer',
            isDemo: true,
            title: 'Culinary Explorer & Lifestyle Vlogger',
            niche: 'Food',
            location: 'Los Angeles, USA',
            website: 'https://tiktok.com/@sarahfoodie.demo',
            phone: '+1 (555) 876-5432',
            followers: '850K',
            postReach: '210K',
            storyViews: '60K',
            engagementRate: '5.2%',
            profileVisits: '280K',
            country: 'United States',
            city: 'Los Angeles',
            ageGroup: '22-30',
            bio: 'Sharing drool-worthy restaurant experiences, chef collaborations, and artisan cafe spots.',
            profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop',
            skills: ['Food Photography', 'Recipe Reels', 'Restaurant UGC'],
            verificationScreenshots: [],
            createdAt: '2026-10-22T10:45:00.000Z'
        },
        // Demo Influencer 3
        {
            _id: 'demo-inf-3',
            name: 'David Tech',
            email: 'david@prokonnect.demo',
            passwordHash: 'phash_54321demo',
            role: 'influencer',
            isDemo: true,
            title: 'PC Hardware & Consumer Electronics Reviewer',
            niche: 'Tech',
            location: 'Austin, USA',
            website: 'https://youtube.com/davidtech.demo',
            phone: '+1 (555) 765-4321',
            followers: '2.5M',
            postReach: '890K',
            storyViews: '250K',
            engagementRate: '6.1%',
            profileVisits: '1.1M',
            country: 'United States',
            city: 'Austin',
            ageGroup: '25-35',
            bio: 'In-depth benchmarks, unboxing reviews, and setup tours for high-performance PC hardware.',
            profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
            skills: ['Video Production', 'Benchmarks', 'Hardware Teardowns'],
            verificationScreenshots: [],
            createdAt: '2026-10-12T16:20:00.000Z'
        }
    ],

    offers: [
        {
            _id: 'demo-offer-1',
            title: 'Summer Streetwear Capsule Reel Showcase',
            description: 'Looking for high-energy fashion creators to style our new unisex summer collection. Deliverables include 1 dedicated Instagram Reel + 3 high-res photo carousel for our official lookbook.',
            type: 'paid',
            category: 'fashion',
            targetAudience: 'influencers',
            price: 350,
            businessId: 'demo-biz-1',
            active: true,
            status: 'active',
            analytics: { views: 2840, clicks: 490 },
            requirements: ['1x Instagram Reel', '3x Lookbook Carousel Photos', 'Link in Bio for 48 Hours'],
            createdAt: '2026-11-10T10:00:00.000Z'
        },
        {
            _id: 'demo-offer-2',
            title: 'Ultralight 49g Gaming Mouse Unboxing & Gameplay Review',
            description: 'Receive our brand-new competitive wireless mouse. Stream live gameplay showcasing latency performance and post an unboxing review on YouTube Shorts or TikTok.',
            type: 'paid',
            category: 'gaming',
            targetAudience: 'everyone',
            price: 500,
            businessId: 'demo-biz-2',
            active: true,
            status: 'active',
            analytics: { views: 3410, clicks: 720 },
            requirements: ['Live Twitch/YouTube Stream mention', '1x Dedicated Short/Reel', 'Honest Sensor Review'],
            createdAt: '2026-11-12T14:30:00.000Z'
        },
        {
            _id: 'demo-offer-3',
            title: '3-Night Oceanfront Barter Villa Stay & Spa Experience',
            description: 'Experience 3 complimentary nights at our private cliffside villa with our signature massage and infinity pool dining. Capture the serene experience for travel enthusiasts.',
            type: 'barter',
            category: 'hotel',
            targetAudience: 'influencers',
            price: 0,
            businessId: 'demo-biz-3',
            active: true,
            status: 'active',
            analytics: { views: 4120, clicks: 890 },
            requirements: ['2x High-Quality Travel Reels', '5x Instagram Stories Tagging Location', 'Content Rights for Website'],
            createdAt: '2026-11-08T09:15:00.000Z'
        },
        {
            _id: 'demo-offer-4',
            title: 'Minimalist Studio Desk Setup Collab',
            description: 'Feature our ergonomic mechanical keyboard in your studio setup aesthetic. Great opportunity for productivity and tech influencers.',
            type: 'paid',
            category: 'tech',
            targetAudience: 'influencers',
            price: 250,
            businessId: 'demo-biz-2',
            active: true,
            status: 'active',
            analytics: { views: 1650, clicks: 230 },
            requirements: ['Desk Setup Showcase Reel', 'Affiliate link integration'],
            createdAt: '2026-11-14T12:00:00.000Z'
        },
        {
            _id: 'demo-offer-5',
            title: 'Autumn Fashion Lookbook Ambassador Program',
            description: 'Long-term brand ambassadorship opportunity. Receive seasonal wardrobe packages and earn 15% revenue share on your custom code.',
            type: 'paid',
            category: 'fashion',
            targetAudience: 'students',
            price: 180,
            businessId: 'demo-biz-1',
            active: true,
            status: 'active',
            analytics: { views: 1220, clicks: 190 },
            requirements: ['Campus Lookbook Post', '2x Monthly Story mentions'],
            createdAt: '2026-11-15T15:45:00.000Z'
        }
    ],

    applications: [
        // Accepted application: Alex Rivera applied to Vogue Apparel
        {
            _id: 'demo-app-1',
            offerId: 'demo-offer-1',
            influencerId: 'demo-inf-1',
            businessId: 'demo-biz-1',
            status: 'accepted',
            pitchMessage: "Hey Vogue team! Huge fan of your recent drop. My audience of 1.2M loves high-fashion street blends. I can style this capsule with vintage leather and shoot a 60fps cinematic reel in SoHo.",
            createdAt: '2026-11-16T11:00:00.000Z'
        },
        // Pending application: David Tech applied to Apex Gaming Gear
        {
            _id: 'demo-app-2',
            offerId: 'demo-offer-2',
            influencerId: 'demo-inf-3',
            businessId: 'demo-biz-2',
            status: 'pending',
            pitchMessage: "I have 2.5M tech enthusiasts and would love to run a full sensor latency comparison on my channel. Can deliver a 1080p Short + Community post within 4 days of receiving sample.",
            createdAt: '2026-11-17T15:20:00.000Z'
        },
        // Rejected application: Sarah Chen applied to Grand Horizon Resort
        {
            _id: 'demo-app-3',
            offerId: 'demo-offer-3',
            influencerId: 'demo-inf-2',
            businessId: 'demo-biz-3',
            status: 'rejected',
            pitchMessage: "Visiting Bali next month! Would love to feature the resort's cliffside dining in my Southeast Asia food travel series.",
            createdAt: '2026-11-14T10:15:00.000Z'
        }
    ]
};
